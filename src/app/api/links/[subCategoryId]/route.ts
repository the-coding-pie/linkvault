import { PAGINATION_LIMIT } from "@/configs";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Props {
  params: {
    subCategoryId: string;
  };
}

export const GET = async (
  req: NextRequest,
  { params: { subCategoryId } }: Props
) => {
  try {
    // check if sub category exists
    const subCategoryExists = await db.subCategory.findFirst({
      where: {
        id: parseInt(subCategoryId),
      },
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!subCategoryExists) {
      return NextResponse.json({
        success: false,
        message: "No such sub category exists",
        statusCode: 404,
      });
    }

    const p =
      (req.nextUrl.searchParams.get("page")
        ? parseInt(req.nextUrl.searchParams.get("page")!)
        : 1) || 1;
    const limit = PAGINATION_LIMIT;

    const skip = (p - 1) * limit;

    const [links, count] = await db.$transaction([
      db.link.findMany({
        where: {
          subCategoryId: subCategoryExists.id,
        },
        orderBy: [
          {
            votes: {
              _count: "desc",
            },
          },
          {
            title: "desc",
          },
        ],
        skip: skip,
        take: limit,
        select: {
          votes: {
            select: {
              userId: true,
            },
          },
          createdAt: true,
          description: true,
          id: true,
          postedBy: {
            select: {
              id: true,
              username: true,
              profile: true,
            },
          },
          subCategoryId: true,
          title: true,
          url: true,
        },
      }),
      db.link.count({
        where: {
          subCategoryId: parseInt(subCategoryId),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        links: links.map((link) => ({
          ...link,
          votes: link.votes.map((user) => user.userId),
        })),
        totalResults: count,
        subCategory: subCategoryExists,
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
