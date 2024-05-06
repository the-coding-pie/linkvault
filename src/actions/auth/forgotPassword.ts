"use server";

import { APP_NAME, CLIENT_URL, FORGOT_PASSWORD_TOKEN_LENGTH } from "@/configs";
import { db } from "@/lib/db";
import forgotPasswordSchema, {
  ForgotPasswordSchemaType,
} from "@/schemas/forgotPassword";
import { createDate, TimeSpan } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import nodemailer from "nodemailer";
import success from "@/lib/responses/success";
import failure from "@/lib/responses/failure";
import validateRequest from "@/lib/auth/validateRequest";

const forgotPassword = async (data: ForgotPasswordSchemaType) => {
  try {
    // you should be not logged in inorder to do this
    const { session } = await validateRequest();

    if (session) {
      return failure("You should be not logged in.");
    }

    // validation
    const validatedFields = forgotPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
      return failure(validatedFields.error.issues[0].message);
    }

    // fields are valid
    const { email } = validatedFields.data;

    const userExists = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userExists) {
      // delete old record if any exists
      const forgotPasswordExists = await db.forgotPassword.findFirst({
        where: {
          userId: userExists.id,
        },
      });

      if (forgotPasswordExists) {
        await db.forgotPassword.delete({
          where: { id: forgotPasswordExists.id },
        });
      }

      const newToken = generateRandomString(
        FORGOT_PASSWORD_TOKEN_LENGTH,
        alphabet("0-9", "A-Z")
      );

      const newForgotPassword = await db.forgotPassword.create({
        data: {
          userId: userExists.id,
          token: newToken,
          expiresAt: createDate(new TimeSpan(3, "d")), // 3 days
        },
      });

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
        to: userExists.email,
        subject: "Forgot Your Password?",
        html: `
          <h1>Forgot your password? It happens to the best of us.</h1>
          <p style="font-size: 16px; font-weight: 600;">To reset your password, click the link below. The link will self-destruct after three days.</p>
          
          <a style="font-size: 14px;" href=${CLIENT_URL}/reset-password/${newForgotPassword.token} target="_blank">Click here to reset your password</a>
  
          <br />
          <br />
  
          <p style="font-size: 14px;">If you do not want to change your password or didn't request a reset, you can ignore and delete this email.</p>
        `,
      };

      // fail silently if error happens
      transporter.sendMail(mailOptions, function () {
        transporter.close();
      });
    }

    return success(
      "If an account exists for the email address, you will get an email with instructions on resetting your password. If it doesn't arrive, be sure to check your spam folder."
    );
  } catch {
    return failure("Something went wrong");
  }
};

export default forgotPassword;
