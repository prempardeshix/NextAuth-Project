import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const res = NextResponse.json({
      message: "Logged-Out Successfully!",
      success: true,
    });

    res.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e.message,
      },
      { status: 500 }
    );
  }
}
