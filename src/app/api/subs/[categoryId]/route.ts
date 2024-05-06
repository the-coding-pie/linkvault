import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Props {
  params: {
    categoryId: string;
  };
}

export const GET = async (
  _: NextRequest,
  { params: { categoryId } }: Props
) => {
  try {
    // check if such category exists
    const categoryExists = await db.category.findFirst({
      where: {
        id: parseInt(categoryId),
      },
      select: {
        name: true,
        id: true,
      },
    });

    if (!categoryExists) {
      return NextResponse.json({
        success: false,
        message: "No such category exists",
        statusCode: 404,
      });
    }

    const subCategories = await db.subCategory.findMany({
      where: {
        categoryId: categoryExists.id,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        subCategories,
        category: categoryExists,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
