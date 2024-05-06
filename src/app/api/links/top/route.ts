import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const topLinks = await db.link.findMany({
      orderBy: [
        {
          votes: {
            _count: "desc",
          },
        },
      ],
      take: 20,
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
        subCategory: {
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
        },
        title: true,
        url: true,
      },
    });
    return NextResponse.json({
      success: true,
      data: topLinks.map((link) => ({
        ...link,
        votes: link.votes.map((user) => user.userId),
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
