import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { get } from "http";

export async function getDataFromToken(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decoded: any = jwt.verify(token, process.env.NEXT_SECRET!);
    const username = decoded.username;
    return username;
  } catch (e: any) {
    return NextResponse.json({
      error: e.message,
    });
  }
}
