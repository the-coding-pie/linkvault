"use server";

import lucia from "@/lib/auth/lucia";
import validateRequest from "@/lib/auth/validateRequest";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import verifyVerificationCode from "@/lib/verifyVerificationCode";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const verifyEmail = async (code: string) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return failure("Login to verify the email");
    }

    const validCode = await verifyVerificationCode(user, code);

    if (!validCode) {
      return failure("Invalid code");
    }

    await lucia.invalidateUserSessions(user.id);

    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // revalidate everything
    revalidatePath("/", "layout");

    return success("Email verified successfully!");
  } catch {
    return failure("Something went wrong");
  }
};

export default verifyEmail;
