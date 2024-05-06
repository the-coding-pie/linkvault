import { CLIENT_URL } from "@/configs";
import { CategoryObj, SubCategoryObj } from "@/types/interfaces";
import axios from "axios";
import { notFound } from "next/navigation";

export const getSubCategories = async (
  categoryId: string
): Promise<{
  subCategories: SubCategoryObj[];
  category: Partial<CategoryObj>;
}> => {
  const res = await axios.get(`${CLIENT_URL}/api/subs/${categoryId}`);

  if (!res.data?.success && res.data.statusCode === 404) {
    return notFound();
  }

  const { subCategories, category } = res.data?.data;

  return {
    subCategories: subCategories || [],
    category: category || {},
  };
};
