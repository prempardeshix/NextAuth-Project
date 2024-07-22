import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getDataFromToken } from "@/utils/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    const username = await getDataFromToken(req);

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // console.log(user);

    if (!user) {
      return NextResponse.json({
        message: "User does not exist!",
      });
    }

    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (e: any) {
    return NextResponse.json({
      error: e.message,
    });
  }
}
