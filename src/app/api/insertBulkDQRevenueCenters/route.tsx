import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../../lib/dbUtils';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const salesid = req.nextUrl.searchParams.get('salesid');
        const reqBody = await req.json(); // Expecting an array of user data from the client

    if (!Array.isArray(reqBody) || reqBody?.length === 0) {
        return new NextResponse(
            JSON.stringify({ status: 400, error: 'No data provided or invalid format' }),
            { status: 400 }
        );
    }
    // Prepare the query and values
    const pool = getPool();
    const query = 'INSERT INTO hisabr.dq_revenue_centers (sales_id, dq_category_name, quantity, total, percent) VALUES ?';
    const values = reqBody?.map((i: any) => [
        salesid,
        i?.name,
        i?.quantity,
        i?.total,
        i?.percent
    ]);
    const result = pool.query(query, [values]);
    const results = result[0];
    return new NextResponse(
        JSON.stringify({ status: 200, message: 'Records inserted successfully', results}),
        { status: 200 }
        );
    } catch (error) {
      console.error(error);
      return new NextResponse(
        JSON.stringify({ status: 500, error: 'Server error / Database error' }),
        { status: 500 }
      );
    }
}
