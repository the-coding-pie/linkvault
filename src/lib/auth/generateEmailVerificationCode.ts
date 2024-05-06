import "server-only";

import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { db } from "../db";

const generateEmailVerificationCode = async (
  userId: number
): Promise<{ code: string; newEmailVerificationId: number }> => {
  const code = generateRandomString(8, alphabet("0-9"));

  const newEmailVerification = await db.emailVerification.create({
    data: {
      userId: userId,
      code,
      expiresAt: createDate(new TimeSpan(30, "m")), // 30 minutes
    },
  });

  return { code, newEmailVerificationId: newEmailVerification.id };
};

export default generateEmailVerificationCode;
