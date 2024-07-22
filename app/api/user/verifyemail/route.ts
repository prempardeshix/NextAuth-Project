import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;
    console.log(token);
    const temp = new Date(Date.now());

    const result = await prisma.user.update({
      where: {
        verifyToken: token,
        // verifyTokenExpiry: {
        //   gt: temp,
        // },
      },
      data: {
        isVerified: true,
        verifyToken: "",
        verifyTokenExpiry: new Date(Date.now()),
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          message: "Invalid Token.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      message: "E-Mail verified successfully!",
      success: true,
    });
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
