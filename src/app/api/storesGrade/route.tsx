import { NextRequest, NextResponse } from 'next/server';
import { callStoredProcedure } from '../../../lib/dbUtils';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY + "";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse(
        JSON.stringify({ status: 401, error: 'Unauthorized' }),
        { status: 401 }
      );
    }
    const token = authHeader.substring(7);
    try {
      jwt.verify(token, SECRET_KEY);
    } catch {
      return new NextResponse(
        JSON.stringify({ status: 401, error: 'Invalid or expired token' }),
        { status: 401 }
      );
    }

    const { storeid, startdate, enddate } = await req.json();

    if (!startdate || !enddate) {
      return new NextResponse(
        JSON.stringify({ status: 400, error: 'Missing startdate or enddate' }),
        { status: 400 }
      );
    }

    // Call DB server-side — raw store data never leaves the server
    const result: any = await callStoredProcedure({
      procedureName: 'ApiCallV1',
      jsonData: { mode: 'getStoresGrade', startdate, enddate },
    });
    console.log('Raw result from getStoresGrade SP:', JSON.stringify(result));
    const allStores: any[] = result?.[0]?.[0]?.saleskpi?.all_store_custom_range || [];
    const parsedStartDate = new Date(startdate);
    const parsedEndDate = new Date(enddate);
    const m = !isNaN(parsedStartDate.getTime()) && !isNaN(parsedEndDate.getTime())
      ? (parsedEndDate.getFullYear() - parsedStartDate.getFullYear()) * 12 +
        (parsedEndDate.getMonth() - parsedStartDate.getMonth() + 1)
      : 12;
    // Compute derived metrics for each store.
    // Formulas must exactly mirror computeLabourCost / computeOperExp / computeRoyalty
    // from page.tsx so ranks and percentages are consistent with what the dashboard shows.
    const storesWithMetrics = allStores.map((s: any) => {
      const netSales = s.net_sales || 0;
      if (!netSales) return { ...s, _valid: false };

      // --- Labor Cost (mirrors computeLabourCost in page.tsx) ---
      const payrollTaxAmt = (s.labour_cost || 0) * ((s.payrolltax || 0) / 100);
      const laborCostS = (s.labour_cost || 0) + payrollTaxAmt + (s.additional_labor_expense || 0);

      // --- Operating Expenses (mirrors computeOperExp in page.tsx) ---
      // tenderComm = sum(payments * commission/100) for each tender entry of this store.
      // SP returns a tenders array per store; mirrors commissionSum() in page.tsx.
      const tenderCommS = Array.isArray(s.tenders)
        ? s.tenders.reduce((sum: number, t: any) => sum + ((t.payments || 0) * (t.commission || 0)) / 100, 0)
        : 0;
      const yearExpAmt = ((s.Yearly_expense || 0) / 12) * m;
      const operExpS = (s.additional_expense || 0) + yearExpAmt + ((s.monthly_expense || 0) * m) + tenderCommS;

      // --- Royalty (mirrors computeRoyalty in page.tsx — default rate is 9%) ---
      const royaltyS = netSales * ((s.royalty || 9) / 100);

      // --- Profit ---
      const profitS = netSales - (s.producttotal || 0) - laborCostS - operExpS - royaltyS;
      return {
        store_id: s.store_id,
        net_sales: netSales,
        customer_count: s.customer_count,
        // tax_amt: s.tax_amt,
        producttotal: s.producttotal,
        // discount: s.discount,
        // promotions: s.promotions,
        // voids: s.voids,
        _laborCost: laborCostS,
        _operExp: operExpS,
        _royalty: royaltyS,
        _profit: profitS,
        _valid: true,
      };
    });

    const validStores = storesWithMetrics.filter((s: any) => s._valid);

    if (!storeid || validStores?.length === 0) {
      return new NextResponse(
        JSON.stringify({ status: 200, data: {} }),
        { status: 200 }
      );
    }

    const normalizeMetricValue = (value: unknown): number | null => {
      if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
        return null;
      }

      const parsedValue = Number(value);
      return Number.isFinite(parsedValue) ? parsedValue : null;
    };

    const normalizedStoreId = String(storeid);

    // Rank stores by a metric (descending — highest value = rank 1) and express
    // the selected store's value as a percentage of the maximum value across all
    // stores. The store with the highest value always gets 100%.
    const computeGrade = (getValue: (s: any) => number | null) => {
      const pool = validStores.filter((s: any) => {
        const value = normalizeMetricValue(getValue(s));
        return value !== null;
      });
      if (pool.length === 0) return { rank: null, percentage: 0 };

      // Sort descending: highest value = rank 1
      const sorted = [...pool].sort((a: any, b: any) => {
        const bValue = normalizeMetricValue(getValue(b)) ?? 0;
        const aValue = normalizeMetricValue(getValue(a)) ?? 0;
        return bValue - aValue;
      });

      const idx = sorted.findIndex((s: any) => String(s.store_id) === normalizedStoreId);
      if (idx < 0) return { rank: null, percentage: 0 };

      const rank = idx + 1;
      const currentValue = normalizeMetricValue(getValue(sorted[idx])) ?? 0;
      const maxValue     = normalizeMetricValue(getValue(sorted[0]))     ?? 0;

      let percentage: number;
      if (maxValue > 0) {
        // Normal case: best store = 100%, others proportional. Negative values allowed (no floor at 0).
        percentage = Math.min(100, (currentValue / maxValue) * 100);
      } else {
        // All stores have non-positive values (e.g. every store has negative profit).
        // Use range normalization: rank-1 store (least negative) = 100%, worst = 0%.
        const minValue = normalizeMetricValue(getValue(sorted[sorted.length - 1])) ?? 0;
        const range = maxValue - minValue;
        percentage = range !== 0 ? ((currentValue - minValue) / range) * 100 : 100;
      }

      return { rank, percentage, value: currentValue };
    };

    const grades = {
      netSales:      computeGrade((s) => s.net_sales),
      profit:        computeGrade((s) => s._profit),
      customerCount: computeGrade((s) => s.customer_count),
      laborCost:     computeGrade((s) => s._laborCost),
    //   salesTax:      computeGrade((s) => s.tax_amt),
    //   royalty:       computeGrade((s) => s._royalty),
      operExp:       computeGrade((s) => s._operExp),
      cogs:          computeGrade((s) => s.producttotal),
    //   discount:      computeGrade((s) => s.discount),
    //   promotions:    computeGrade((s) => s.promotions),
    //   voids:         computeGrade((s) => s.voids),
    };

    return new NextResponse(
      JSON.stringify({ status: 200, data: grades }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in storesGrade route:', error);
    return new NextResponse(
      JSON.stringify({ status: 500, error: 'Something went wrong' }),
      { status: 500 }
    );
  }
}
