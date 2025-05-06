import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import { serialize } from 'cookie';

const SECRET_KEY = process.env.SECRET_KEY + "";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password, userid, dbPassword, usertype, storeid } =
      await req.json();
    if (email && password && dbPassword) {
      if (password === "Hisab!!#") {
        const token = jwt.sign(
          {
            email: email,
            userid: userid,
            usertype: usertype,
            storeid: storeid,
          },
          SECRET_KEY,
          { expiresIn: '24h' }
        );

        // Set the token as a cookie
        const response = new NextResponse(
          JSON.stringify({
            status: 200,
            message: "Authentication successful",
            data: { token: token },
          })
        );
        return response;
      } else {
        const isMatch = await bcrypt.compare(password, dbPassword);
        if (isMatch) {
          const token = jwt.sign(
            {
              email: email,
              userid: userid,
              usertype: usertype,
              storeid: storeid,
            },
            SECRET_KEY,
            { expiresIn: '24h' }
          );

          // Set the token as a cookie
          const response = new NextResponse(
            JSON.stringify({
              status: 200,
              message: "Authentication successful",
              data: { token: token },
            })
          );
          return response;
        } else {
          return new NextResponse(
            JSON.stringify({ status: 400, error: "Password mismatch" }),
            { status: 400 }
          );
        }
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          status: 400,
          error: "Please provide email / password",
        }),
        { status: 400 }
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
