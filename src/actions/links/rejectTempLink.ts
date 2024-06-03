"use server";
import validateRequest from "@/lib/auth/validateRequest";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";

const rejectTempLink = async ({ id }: { id: number }) => {
  try {
    const { user } = await validateRequest();

    if (!user?.isAdmin) {
      return failure("Something went wrong");
    }

    // add item to tempLink table
    await db.tempLink.delete({
      where: {
        id,
      },
    });

    return success("Rejected 👍!");
  } catch {
    return failure("Something went wrong");
  }
};

export default rejectTempLink;
