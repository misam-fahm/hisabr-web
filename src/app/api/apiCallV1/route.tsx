import { NextRequest, NextResponse } from 'next/server';
import { callStoredProcedure } from '../../../lib/dbUtils';
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the incoming JSON request body
    let reqData: any = await req.json();

    // Validate that the required fields are present in reqData
    if (!reqData || !reqData.mode) {
      // If no mode or required fields are present, return a 400 Bad Request error
      return new NextResponse(
        JSON.stringify({ status: 400, error: 'Bad request: Missing required fields' }),
        { status: 400 }
      );
    }

    if (reqData.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(reqData.password, saltRounds);
      reqData.password = hashedPassword;
    }

    const result: any = await callStoredProcedure({
      procedureName: reqData.sp ?? 'ApiCallV1',
      jsonData: reqData, 
    });

    if (Object.keys(result[0][0])?.length === 0) {
      // If the data is empty, return a 204 No Content status
      return new NextResponse(
        JSON.stringify({ status: 204, message: 'No data found', data: null }), // Indicating successful request but no data
        { status: 204 }
      );
    }

    // Check if the result is valid and contains the expected data
    if (!result || !result[0] || !result[0][0]) {
      // If the result is invalid or empty, return a 404 Not Found error
      return new NextResponse(
        JSON.stringify({ status: 404, error: 'No data found or invalid result' }),
        { status: 404 }
      );
    }

    if (result[0][0]?.error_message) {
      return new NextResponse(
        JSON.stringify({ status: 400, error: result[0][0]?.error_message }),
        { status: 200 }
      );
    }

    // Prepare the response body with a success message
    const responseBody: any = {
      status: 200,
      message: 'success',
      data: result[0][0], // Include the relevant data here
    };

    // Return the successful response with a 200 status code
    return new NextResponse(
      JSON.stringify(responseBody),
      { status: 200 }
    );

  } catch (error: any) {
    // Log the error for debugging purposes
    console.error('Error during request processing:', error);

    // Check if the error is related to the stored procedure call or database connection
    if (error.code === 'ER_BAD_FIELD_ERROR' || error.code === 'ER_NO_SUCH_TABLE') {
      // For SQL errors like missing fields or tables, return a 400 Bad Request error
      return new NextResponse(
        JSON.stringify({ status: 400, error: 'Bad request: Invalid query or missing data' }),
        { status: 400 }
      );
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      // For database access issues, return a 403 Forbidden error
      return new NextResponse(
        JSON.stringify({ status: 403, error: 'Forbidden: Database access denied' }),
        { status: 403 }
      );   
    }

    // Return a generic 500 Internal Server Error if no specific error code is matched
    return new NextResponse(
      JSON.stringify({ status: 500, error: 'Something went wrong' }),
      { status: 500 }
    ); 
  }
}

