import { CLIENT_URL } from "@/configs";
import { LinkObj } from "@/types/interfaces";
import axios from "axios";
import { notFound } from "next/navigation";

export const getTempLinks = async (): Promise<{
  links: LinkObj[];
}> => {
  const res = await axios.get(`${CLIENT_URL}/api/temp-links`);

  if (!res.data?.success && res.data.statusCode === 404) {
    return notFound();
  }

  const tempLinks = res.data?.data;

  return {
    links: tempLinks,
  };
};
