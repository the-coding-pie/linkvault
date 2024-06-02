import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const tempLinks = await db.tempLink.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 20,
      select: {
        category: true,
        categoryNew: true,
        postedBy: true,
        subCategory: true,
        subCategoryNew: true,
        updatedAt: true,
        createdAt: true,
        description: true,
        id: true,
        title: true,
        url: true,
      },
    });
    return NextResponse.json({
      success: true,
      data: tempLinks.map((link) => ({
        ...link,
      })),
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
