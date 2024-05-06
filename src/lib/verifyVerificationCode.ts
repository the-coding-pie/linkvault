import "server-only";

import { User } from "lucia";
import { db } from "./db";
import { isWithinExpirationDate } from "oslo";

const verifyVerificationCode = async (
  user: User,
  code: string
): Promise<boolean> => {
  const emailVerficationExists = await db.emailVerification.findFirst({
    where: { userId: user.id },
  });

  if (!emailVerficationExists || emailVerficationExists.code !== code) {
    return false;
  }

  await db.emailVerification.delete({
    where: { id: emailVerficationExists.id },
  });

  if (!isWithinExpirationDate(emailVerficationExists.expiresAt)) {
    return false;
  }

  return true;
};

export default verifyVerificationCode;
