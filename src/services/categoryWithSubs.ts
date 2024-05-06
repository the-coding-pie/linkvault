import { CategoriesWithSubsObj } from "@/types/interfaces";
import axios from "axios";

export const getCategoryWithSubs = async (): Promise<{
  categories: CategoriesWithSubsObj[];
}> => {
  const res = await axios.get(`/api/category-with-subs`);

  const categories = res.data?.data;

  return {
    categories: categories || [],
  };
};
