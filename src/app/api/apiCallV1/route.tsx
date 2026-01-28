import { NextRequest, NextResponse } from 'next/server';
import { callStoredProcedure } from '../../../lib/dbUtils';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY + "";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the incoming JSON request body first to check the mode
    let reqData: any = await req.json();

    // List of modes that don't require authentication (e.g., login, register)
    const publicModes = ['login', 'register', 'forgotPassword', 'resetPassword', 'getUserByEmail', 'generateUUID', 'verifyUser'];

    // Check if the current mode requires authentication
    const requiresAuth = !publicModes.includes(reqData.mode);

    // Check for authorization token only if authentication is required
    if (requiresAuth) {
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new NextResponse(
          JSON.stringify({
            status: 401,
            error: 'Unauthorized: No token provided'
          }),
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      if (!token) {
        return new NextResponse(
          JSON.stringify({
            status: 401,
            error: 'Unauthorized: Invalid token format'
          }),
          { status: 401 }
        );
      }

      // Verify the token is valid
      try {
        jwt.verify(token, SECRET_KEY);
      } catch (err: any) {
        return new NextResponse(
          JSON.stringify({
            status: 401,
            error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
          }),
          { status: 401 }
        );
      }
    }

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

