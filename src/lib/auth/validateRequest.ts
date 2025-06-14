import "server-only";

import { Session, User } from "lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import lucia from "./lucia";

const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        // if fresh -> session expiration has been extended, so set new cookie
        const sessionCookie = lucia.createSessionCookie(result.session.id);

        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      if (!result.session) {
        // delete the cookie
        const sessionCookie = lucia.createBlankSessionCookie();

        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}

    return result;
  }
);

export default validateRequest;
