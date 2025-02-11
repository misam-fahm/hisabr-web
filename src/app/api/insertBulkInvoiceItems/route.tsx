import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../../lib/dbUtils';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const invoiceid = req.nextUrl.searchParams.get('invoiceid');
        const { invoiceDetails } = await req.json(); // Expecting an array of user data from the client

    if (!Array.isArray(invoiceDetails) || invoiceDetails?.length === 0) {
        return new NextResponse(
            JSON.stringify({ status: 400, error: 'No data provided or invalid format' }),
            { status: 400 }
        );
    }

    // Prepare the query and values
    const pool = getPool();
    const query = 'INSERT INTO hisabr.invoice_details (invoice_id, item_code, item_name, brand, category, quantity, unit, pack_size, invt_value, unit_price, tax, extended_price) VALUES ?';
    const values = invoiceDetails?.map((i: any) => [
                        invoiceid,
                        i?.item_code,
                        i?.item_description,
                        i?.brand,
                        i?.category,
                        i?.qty_ship,
                        i?.unit,
                        i?.pack_size,
                        i?.invent_value,
                        i?.unit_price,
                        i?.tax,
                        i?.extended_price
                      ]);
    // Ensure each user has first_name, last_name, and email properties
    // const values = users.map(user => [user.first_name, user.last_name, user.email]);
        const result = pool.query(query, [values]);
        const results = result[0];
        // pool.query(query, [values], (error, results) => {
        // if (error) {
        //   console.error(error);
        //   return res.status(500).json({ error: 'Database error' });
        // }
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
