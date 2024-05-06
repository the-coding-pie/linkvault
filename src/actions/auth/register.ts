"use server";

import { APP_NAME, CLIENT_URL } from "@/configs";
import generateEmailVerificationCode from "@/lib/auth/generateEmailVerificationCode";
import lucia from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import genUsername from "@/lib/genUsername";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import registerSchema, { RegisterSchemaType } from "@/schemas/register";
import argon2 from "argon2";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

const register = async (data: RegisterSchemaType) => {
  try {
    // validation
    const validatedFields = registerSchema.safeParse(data);

    if (!validatedFields.success) {
      return failure(validatedFields.error.issues[0].message);
    }

    // fields are valid
    const { email, name, password } = validatedFields.data;

    // check if user already exists with that email
    const userExists = await db.user.findFirst({ where: { email: email } });

    if (userExists) {
      // check if email already verified
      if (userExists.emailVerified) {
        return failure("Email already taken. Please log in.");
      }

      // check if it exists on the emailVerification table (pending for verification)
      const emailVerficationExists = await db.emailVerification.findFirst({
        where: { userId: userExists.id, expiresAt: { gt: new Date() } },
      });

      if (emailVerficationExists) {
        return failure("Email already taken. Please log in.");
      }

      // if email not verified and link has expired
      // remove the user, emailVerification record, forgotPassword,
      // then create a new user
      const forgotPasswordExists = await db.forgotPassword.findFirst({
        where: { userId: userExists.id },
      });

      if (forgotPasswordExists) {
        await db.forgotPassword.delete({
          where: {
            id: forgotPasswordExists.id,
          },
        });
      }

      await db.emailVerification.delete({ where: { userId: userExists.id } });
      await db.user.delete({ where: { id: userExists.id } });
    }

    // create new user
    const username = await genUsername();
    const hashedPassword = await argon2.hash(password);

    const newUser = await db.user.create({
      data: {
        username,
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    const { code, newEmailVerificationId } =
      await generateEmailVerificationCode(newUser.id);

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
      to: newUser.email,
      subject: "Verify Email",
      html: `
      <h1>Verify your email address</h1>
      <p style="font-size: 16px; font-weight: 600;">To start using ${APP_NAME}, make sure you are logged in first, then just click the verify link below:</p>
      <p style="font-size: 14px; font-weight: 600; color: red;">And only click the link if you are the person who initiated this process.</p>
      <br />
      <a style="font-size: 14px;" href=${CLIENT_URL}/email/verify/${code} target="_blank">Click here to verify your email</a>
      `,
    };

    // fail silently if error happens
    transporter.sendMail(mailOptions, async function (err) {
      if (err) {
        await db.emailVerification.update({
          where: {
            id: newEmailVerificationId,
          },
          data: {
            emailSent: false,
          },
        });
      }

      transporter.close();
    });

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // revalidate everything
    revalidatePath("/", "layout");

    return success(
      "Your account has been created successfully! Please verify your email."
    );
  } catch {
    return failure("Something went wrong");
  }
};

export default register;
