"use server";

import validateRequest from "@/lib/auth/validateRequest";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import { revalidatePath, revalidateTag } from "next/cache";

interface voteArgs {
  linkId: number;
  revalidatePathKeys?: string[];
  revalidateTagKey?: string;
}

const vote = async ({
  linkId,
  revalidatePathKeys,
  revalidateTagKey,
}: voteArgs) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      revalidatePath(`/`, "layout");
      revalidateTagKey && revalidateTag(revalidateTagKey);

      return failure("Login to vote", 403);
    }

    const linkExists = await db.link.findFirst({
      where: {
        id: linkId,
      },
    });

    if (!linkExists) {
      revalidatePathKeys &&
        revalidatePathKeys.map((revalidatePathKey) =>
          revalidatePath(revalidatePathKey)
        );
      revalidateTagKey && revalidateTag(revalidateTagKey);
      return failure("Link doesn't exists", 404);
    }

    // add/remove vote accordingly
    const voteExists = await db.vote.findFirst({
      where: {
        userId: user.id,
        linkId: linkExists.id,
      },
    });

    if (voteExists) {
      // remove it
      await db.vote.delete({
        where: {
          id: voteExists.id,
        },
      });
    } else {
      // add vote
      await db.vote.create({
        data: {
          linkId: linkExists.id,
          userId: user.id,
        },
      });
    }

    revalidatePathKeys &&
      revalidatePathKeys.map((revalidatePathKey) =>
        revalidatePath(revalidatePathKey)
      );
    revalidateTagKey && revalidateTag(revalidateTagKey);

    return success("Vote updated successfully");
  } catch {
    return failure("Something went wrong");
  }
};

export default vote;
