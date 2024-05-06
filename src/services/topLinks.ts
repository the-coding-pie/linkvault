import { LinkWithCategoryAndSubObj } from "@/types/interfaces";

export const getTopLinks = async (): Promise<{
  topLinks: LinkWithCategoryAndSubObj[];
}> => {
  const res = await fetch(`${process.env.CLIENT_URL}/api/links/top`, {
    cache: "no-store",
    next: { tags: ["topLinks"] },
  });

  let topLinks: LinkWithCategoryAndSubObj[] = [];

  if (res.ok) {
    const data = await res.json();

    topLinks = data.data;
  }

  return {
    topLinks: topLinks || [],
  };
};
