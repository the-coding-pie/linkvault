"use server";

import google from "@/lib/auth/google";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

const createGoogleAuthorizationURL = async (prevRoute: string) => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    cookies().set("state", state, {
      httpOnly: true,
    });

    cookies().set("prevRoute", prevRoute, {
      httpOnly: true,
    });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );

    return success(undefined, authorizationURL);
  } catch {
    return failure("Something went wrong");
  }
};

export default createGoogleAuthorizationURL;
