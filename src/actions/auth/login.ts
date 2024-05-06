"use server";

import lucia from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import loginSchema, { LoginSchemaType } from "@/schemas/login";
import argon2 from "argon2";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const login = async (data: LoginSchemaType) => {
  try {
    // validation
    const validatedFields = loginSchema.safeParse(data);

    if (!validatedFields.success) {
      return failure(validatedFields.error.issues[0].message);
    }

    // fields are valid
    const { email, password } = validatedFields.data;

    const userExists = await db.user.findFirst({
      where: {
        OR: [
          {
            email: email,
          },
          {
            username: email,
          },
        ],
      },
    });

    // if sso
    if (userExists && userExists.isOAuth) {
      return failure("This account can only be logged into with Google");
    }

    if (!userExists) {
      return failure("Invalid credentials");
    }

    const validPassword = await argon2.verify(
      userExists.passwordHash!,
      password
    );

    // check password
    if (!validPassword) {
      return failure("Invalid credentials");
    }

    const session = await lucia.createSession(userExists.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // revalidate everything
    revalidatePath("/", "layout");

    return success("You are now logged in");
  } catch {
    return failure("Something went wrong");
  }
};

export default login;
