"use server";

import validateRequest from "@/lib/auth/validateRequest";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import resetPasswordSchema, {
  ResetPasswordSchemaType,
} from "@/schemas/resetPassword";
import argon2 from "argon2";

const resetPassword = async (data: ResetPasswordSchemaType) => {
  try {
    // you should be not logged in inorder to do this
    const { session } = await validateRequest();

    if (session) {
      return failure("You should be not logged in.");
    }

    // validation
    const validatedFields = resetPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
      return failure(validatedFields.error.issues[0].message);
    }

    // fields are valid
    const { token, password } = validatedFields.data;

    // check if token is valid
    const validToken = await db.forgotPassword.findFirst({
      where: {
        AND: [
          {
            token,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
    });

    if (!validToken) {
      return failure(
        "Sorry, your password reset link has expired or is malformed"
      );
    }

    // find the user and reset their password, then delete the row from forgotPassword table
    const userExists = await db.user.findFirst({
      where: {
        id: validToken.userId,
      },
    });

    // rare foolish case -> token exists no user
    if (!userExists) {
      await db.forgotPassword.delete({
        where: {
          id: validToken.id,
        },
      });

      const emailVerificationExists = await db.emailVerification.findFirst({
        where: {
          userId: validToken.userId,
        },
      });

      if (emailVerificationExists) {
        await db.emailVerification.delete({
          where: {
            id: emailVerificationExists.id,
          },
        });
      }

      return failure("Invalid user");
    }

    const hashedPassword = await argon2.hash(password);

    // if user clicks on the link, that indirectly means they verified their email
    const emailVerificationExists = await db.emailVerification.findFirst({
      where: {
        userId: userExists.id,
      },
    });

    if (emailVerificationExists) {
      await db.emailVerification.delete({
        where: {
          id: emailVerificationExists.id,
        },
      });
    }

    await db.user.update({
      where: {
        id: userExists.id,
      },
      data: {
        passwordHash: hashedPassword,
        isOAuth: false,
        emailVerified: true,
      },
    });

    await db.forgotPassword.delete({
      where: {
        id: validToken.id,
      },
    });

    return success("Password changed successfully! You can now login");
  } catch {
    return failure("Something went wrong");
  }
};

export default resetPassword;
