"use server";

import lucia from "@/lib/auth/lucia";
import validateRequest from "@/lib/auth/validateRequest";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const logout = async () => {
  const { session } = await validateRequest();

  if (!session) {
    // revalidate everything
    revalidatePath("/", "layout");

    return failure("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // revalidate everything
  revalidatePath("/", "layout");

  return success("You have been logged out.");
};

export default logout;
