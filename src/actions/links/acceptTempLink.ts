"use server";
import validateRequest from "@/lib/auth/validateRequest";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import { revalidatePath } from "next/cache";

// both below are done from client side
// needs login - but not done
// needs validation - but not done
const acceptTempLink = async (tempLink: {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  subCategory: string;
  categoryNew: boolean;
  subCategoryNew: boolean;
  createdAt: Date;
  userId: number | undefined;
}) => {
  try {
    const { user } = await validateRequest();

    if (!user?.isAdmin) {
      return failure("Something went wrong");
    }

    let category: any = null;
    let subCategory: any = null;

    // create category and sub category if needed
    if (tempLink.categoryNew) {
      // create category
      category = await db.category.create({
        data: {
          name: tempLink.category,
        },
      });
    } else {
      category = await db.category.findFirst({
        where: {
          id: parseInt(tempLink.category),
        },
      });
    }

    if (tempLink.subCategoryNew) {
      // create category
      subCategory = await db.subCategory.create({
        data: {
          name: tempLink.subCategory,
          categoryId: category.id,
        },
      });
    } else {
      subCategory = await db.subCategory.findFirst({
        where: {
          id: parseInt(tempLink.subCategory),
        },
      });
    }

    // add item to tempLink table
    await db.link.create({
      data: {
        title: tempLink.title,
        url: tempLink.url,
        description: tempLink.description,
        userId: tempLink.userId ? tempLink.userId : undefined,
        subCategoryId: subCategory.id,
      },
    });

    // delete temp link
    await db.tempLink.delete({
      where: {
        id: tempLink.id,
      },
    });

    revalidatePath("/admin");

    return success("Accepted 👍!");
  } catch (err) {
    console.log(err);
    return failure("Something went wrong");
  }
};

export default acceptTempLink;
