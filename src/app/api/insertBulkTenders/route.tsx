import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../../lib/dbUtils';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const reqBody = await req.json(); // Expecting an array of user data from the client

    if (!Array.isArray(reqBody) || reqBody?.length === 0) {
        return new NextResponse(
            JSON.stringify({ status: 400, error: 'No data provided or invalid format' }),
            { status: 400 }
        );
    }
    // Prepare the query and values
    const pool = getPool();
    const query = 'INSERT INTO hisabr.tender_txns (tender_id, sales_id, tender_date, quantity, payments, tips, total, percent, store_id) VALUES ?';
    const values = reqBody?.map((i: any) => [
        i?.tenderid,
        i?.salesid,
        i?.tender_date,
        i?.quantity,
        i?.payments,
        i?.tips,
        i?.total,
        i?.percent,
        i?.storeid
    ]);
    // console.log(values);
    // console.log("values");
    // Ensure each user has first_name, last_name, and email properties
    // const values = users.map(user => [user.first_name, user.last_name, user.email]);
        const result = pool.query(query, [values]);
        const results = result[0];
        // console.log(result);
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
