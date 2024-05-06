import "server-only";

import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import { db } from "../db";

const adapter = new PrismaAdapter(db.session, db.user);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      emailVerified: attributes.emailVerified,
      email: attributes.email,
      profile: attributes.profile,
      name: attributes.name,
      isAdmin: attributes.isAdmin,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  email: string;
  emailVerified: boolean;
  profile: string;
  name: string;
  isAdmin: boolean;
}

export default lucia;
