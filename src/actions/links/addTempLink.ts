"use server";

import validateRequest from "@/lib/auth/validateRequest";
import { db } from "@/lib/db";
import failure from "@/lib/responses/failure";
import success from "@/lib/responses/success";
import { AddTempLinkSchemaType } from "@/schemas/addLink";

// both below are done from client side
// needs login - but not done
// needs validation - but not done
const addTempLink = async (data: AddTempLinkSchemaType) => {
  try {
    const { user } = await validateRequest();

    // validate if that link already exists in linkTable
    // if the link exists in subCategory under category, then it is a duplicate
    let categoryExists = undefined;

    if (data.category.isNew) {
      // then category.value is a name
      categoryExists = await db.category.findFirst({
        where: {
          name: data.category.value,
        },
      });
    } else {
      // then category.value is an id
      categoryExists = await db.category.findFirst({
        where: {
          id: parseInt(data.category.value!),
        },
      });
    }

    if (categoryExists) {
      // check for subCategory
      let subCategoryExists = undefined;

      if (data.subCategory.isNew) {
        // then subCategory.value is a name
        subCategoryExists = await db.subCategory.findFirst({
          where: {
            name: data.subCategory.value,
            categoryId: categoryExists.id,
          },
        });
      } else {
        // then subCategory.value is an id
        subCategoryExists = await db.subCategory.findFirst({
          where: {
            id: parseInt(data.subCategory.value!),
            categoryId: categoryExists.id,
          },
        });
      }

      if (subCategoryExists) {
        const linkExists = await db.link.findFirst({
          where: {
            url: data.url,
            subCategoryId: subCategoryExists.id,
          },
        });

        if (linkExists) {
          return failure(
            "The same link already exists on the sub category",
            409
          );
        }
      }
    }

    // check if it already exists on tempLink
    const tempLinkExists = await db.tempLink.findFirst({
      where: {
        url: data.url,
        category: data.category.value,
        categoryNew: data.category.isNew,
        subCategory: data.subCategory.value,
        subCategoryNew: data.subCategory.isNew,
      },
    });

    if (tempLinkExists) {
      return failure(
        "A link with the same information has already been submitted and is awaiting for approval",
        409
      );
    }

    // add item to tempLink table
    await db.tempLink.create({
      data: {
        title: data.title,
        url: data.url,
        description: data.description,
        category: data.category.value!,
        categoryNew: data.category.isNew!,
        subCategory: data.subCategory.value!,
        subCategoryNew: data.subCategory.isNew!,
        userId: user?.id,
      },
    });

    return success("Your submission is in, awaiting our thumbs up 👍!");
  } catch {
    return failure("Something went wrong");
  }
};

export default addTempLink;
