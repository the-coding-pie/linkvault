"use server";

import { APP_NAME, CLIENT_URL } from "@/configs";
import generateEmailVerificationCode from "@/lib/auth/generateEmailVerificationCode";
import validateRequest from "@/lib/auth/validateRequest";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import nodemailer from "nodemailer";

const resendVerifyEmail = async () => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return failure("Login to resend verification email");
    }

    // check if user's email already verified
    if (user.emailVerified) {
      return success("Email already verified!");
    }

    // to prevent email attack
    // check if prev "sent" email verification is still valid
    const emailVerification = await db.emailVerification.findFirst({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
        emailSent: true,
      },
    });

    if (emailVerification) {
      return success("Email resent!");
    }

    // delete old record in emailVerification collection if any exists
    const emailVerificationExists = await db.emailVerification.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (emailVerificationExists) {
      await db.emailVerification.delete({
        where: {
          id: emailVerificationExists.id,
        },
      });
    }

    const { code, newEmailVerificationId } =
      await generateEmailVerificationCode(user.id);

    // send email
    // create a transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL!,
        pass: process.env.GMAIL_PASSWORD!,
      },
    });

    // mail options
    const mailOptions = {
      from: `${APP_NAME} ${process.env.GMAIL}`,
      to: user.email,
      subject: "Verify Email",
      html: ` <h1>Verify your email address</h1>
  <p style="font-size: 16px; font-weight: 600;">To start using ${APP_NAME}, make sure you are logged in first, then just click the verify link below:</p>
  <p style="font-size: 14px; font-weight: 600; color: red;">And only click the link if you are the person who initiated this process.</p>
  <br />
  <a style="font-size: 14px;" href=${CLIENT_URL}/email/verify/${code} target="_blank">Click here to verify your email</a>
`,
    };

    // fail silently if error happens
    transporter.sendMail(mailOptions, async function (err) {
      if (err) {
        // mail has been successfully sent
        await db.emailVerification.update({
          where: { id: newEmailVerificationId },
          data: { emailSent: false },
        });
      }

      transporter.close();
    });

    return success("Email resent!");
  } catch {
    return failure("Something went wrong");
  }
};

export default resendVerifyEmail;
