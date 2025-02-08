import { NextRequest, NextResponse } from "next/server";
import { sendApiRequest } from "@/utils/apiUtils";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const reqData: any = await req.json();
    if (
      !reqData ||
      !reqData.mode ||
      !reqData.email ||
      !reqData.password ||
      !reqData.usertype
    ) {
      return new NextResponse(
        JSON.stringify({
          status: 400,
          error: "Bad request: Missing required fields",
        }),
        { status: 400 }
      );
    }
    const response: any = await sendApiRequest({
      mode: "checkEmailExist",
      email: reqData?.email,
    });
    if (response?.status === 200) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(reqData.password, saltRounds);
      const insertUser: any = await sendApiRequest({
        mode: "insertUser",
        email: reqData.email,
        password: hashedPassword,
        usertype: reqData.usertype,
      });

      if (insertUser?.status === 200) {
        return new NextResponse(
          JSON.stringify({
            status: 201,
            message: "User created successfully",
            data: null,
          }), // Indicating successful request but no data
          { status: 201 }
        );
      } else {
        return new NextResponse(
          JSON.stringify({ status: 400, error: "Failed to create user" }),
          { status: 400 }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({ status: 400, error: response?.error }),
        { status: 400 }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ status: 500, error: "Internal server error" }),
      { status: 500 }
    );
  }
}
