import { CLIENT_URL } from "@/configs";
import { CategoryObj } from "@/types/interfaces";
import axios from "axios";

export const getCategories = async (): Promise<{
  categories: CategoryObj[];
}> => {
  const res = await axios.get(`${CLIENT_URL}/api/categories`);

  const categories = res.data?.data;

  return {
    categories: categories || [],
  };
};
