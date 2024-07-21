import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import prisma from "@/app/lib/db";
// TODO: configure interface for sendEmail parameter

export async function sendEmail({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: string;
  userId: number;
}) {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    const date = new Date(Date.now() + 3600000);

    if (emailType === "VERIFY") {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: date,
        },
      });
    } else if (emailType === "RESET") {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: date,
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "",
        pass: "",
      },
    });

    const mailOptions = {
      from: "prempardeshi@gmailcom",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your E-Mail" : "Reset your PASSWORD",
      html: `<p>Click <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetemail"
      }?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "Verify your E-Mail" : "Reset your PASSWORD"
      } or copy and paste the link in your browser.
      <br>
      ${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetemail"
      }?token=${hashedToken}
      </p>`,
    };

    const info = await transport.sendMail(mailOptions);

    return info;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
