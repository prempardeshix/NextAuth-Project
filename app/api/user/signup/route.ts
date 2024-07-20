import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import prisma from "@/app/lib/db";
import { sendEmail } from "@/utils/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = body;

    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (result) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const done = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    await sendEmail({ email, emailType: "VERIFY", userId: done.id });
    return NextResponse.json({
      message: "Signed Up Successfully, verification link sent to E-Mail ID",
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error: e.message,
      },
      {
        status: 500,
      }
    );
  }
}
