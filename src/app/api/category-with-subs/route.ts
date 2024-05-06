import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const categories = await db.category.findMany({
      include: {
        subCategories: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
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
