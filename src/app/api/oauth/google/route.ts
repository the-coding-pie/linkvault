import { CLIENT_URL } from "@/configs";
import google from "@/lib/auth/google";
import lucia from "@/lib/auth/lucia";
import { db } from "@/lib/db";
import genUsername from "@/lib/genUsername";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const codeVerifier = cookies().get("codeVerifier")?.value;
    const savedState = cookies().get("state")?.value;

    if (!codeVerifier || !savedState) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (savedState !== state) {
      return NextResponse.json(
        { error: "State does not match" },
        { status: 400 }
      );
    }

    const { accessToken } = await google.validateAuthorizationCode(
      code,
      codeVerifier
    );

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      }
    );

    const googleData = (await googleRes.json()) as GoogleUser;

    // if user doesn't exists with this email, create the user
    const userExists = await db.user.findFirst({
      where: {
        email: googleData.email,
      },
    });

    let user: any = null;

    if (!userExists) {
      // create valid username
      const username = await genUsername();

      const newUser = await db.user.create({
        data: {
          username,
          email: googleData.email!.trim(),
          profile: googleData.picture!,
          emailVerified: true,
          isOAuth: true,
          name: googleData.name! || "",
        },
      });

      user = newUser;
    } else {
      // emailVerified false (manual registration)
      if (userExists.emailVerified === false) {
        // delete the old user
        // delete record in the emailVerification collection
        // create new user with isOAuth=true & emailVerified=true
        const forgotPasswordExists = await db.forgotPassword.findFirst({
          where: {
            userId: userExists.id,
          },
        });

        if (forgotPasswordExists) {
          await db.forgotPassword.delete({
            where: {
              id: forgotPasswordExists.id,
            },
          });
        }

        await db.emailVerification.delete({
          where: {
            userId: userExists.id,
          },
        });

        await db.user.delete({
          where: {
            id: userExists.id,
          },
        });

        // create valid username
        const username = await genUsername();

        const newUser = await db.user.create({
          data: {
            username: username,
            email: googleData.email!.trim(),
            profile: googleData.picture!,
            emailVerified: true,
            isOAuth: true,
            name: googleData.name! || "",
          },
        });

        user = newUser;
      } else {
        // user already verified email, so allow Google OAuth
        user = userExists;
      }
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    cookies().set("state", "", { expires: new Date(0) });
    cookies().set("codeVerifier", "", { expires: new Date(0) });

    // revalidate everything
    revalidatePath("/", "layout");

    return NextResponse.redirect(
      new URL(cookies().get("prevRoute")?.value! || "", CLIENT_URL),
      { status: 302 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
