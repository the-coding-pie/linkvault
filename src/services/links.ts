import { CategoryObj, LinkObj, SubCategoryObj } from "@/types/interfaces";
import axios from "axios";
import { notFound } from "next/navigation";

interface SubCategoryObjWithCategory extends SubCategoryObj {
  category: Partial<CategoryObj>;
}

export const getLinks = async (
  subCategoryId: string,
  page: number
): Promise<{
  links: LinkObj[];
  totalResults: number;
  subCategory: SubCategoryObjWithCategory;
}> => {
  const res = await axios.get(
    `${process.env.CLIENT_URL}/api/links/${subCategoryId}?page=${page}`
  );

  if (!res.data?.success && res.data.statusCode === 404) {
    return notFound();
  }

  const { links, totalResults, subCategory } = res.data?.data;

  return {
    links: links || [],
    totalResults: totalResults || 0,
    subCategory: subCategory || {},
  };
};
