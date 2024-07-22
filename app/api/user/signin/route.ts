import prisma from "@/app/lib/db";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          msg: "User does not exist!",
        },
        { status: 400 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        {
          msg: "Invalid password",
        },
        { status: 400 }
      );
    }

    const tokenData = {
      username: user.username,
      email: user.email,
    };

    const result = jwt.sign(tokenData, process.env.NEXT_SECRET!, {
      expiresIn: "1d",
    });

    // console.log(result);

    const res = NextResponse.json({
      msg: "Logged in successfully",
      success: true,
    });

    res.cookies.set("token", result, { httpOnly: true });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
      },
      {
        status: 500,
      }
    );
  }
}
