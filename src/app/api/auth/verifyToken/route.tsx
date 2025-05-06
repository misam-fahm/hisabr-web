import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY + "";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // const token = req.cookies.token;
    const { token } = await req.json();

    if (!token) {
      return new NextResponse(
        JSON.stringify({ status: 401, error: "Unauthorized" }),
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, SECRET_KEY);
      return new NextResponse(
        JSON.stringify({ status: 200, message: "Authorized" }),
        { status: 200 }
      );
    } catch (err) {
      return new NextResponse(
        JSON.stringify({ status: 401, error: "Invalid token" }),
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Error during request processing:", error);
    return new NextResponse(
      JSON.stringify({ status: 500, error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
