"use server";

import validateRequest from "@/lib/auth/validateRequest";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import { AddTempLinkSchemaType } from "@/schemas/addLink";

// both below are done from client side
// needs login - but not done
// needs validation - but not done
const acceptTempLink = async (data: AddTempLinkSchemaType) => {
  try {
    const { user } = await validateRequest();

    // add item to tempLink table
    await db.link.create({
      data: {
        title: "",
        url: "",
        description: "",
      },
    });

    return success("Accepted 👍!");
  } catch {
    return failure("Something went wrong");
  }
};

export default acceptTempLink;
