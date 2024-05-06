import "server-only";

import { Google } from "arctic";
import { CLIENT_URL } from "@/configs";

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  CLIENT_URL! + "/api/oauth/google"
);

export default google;
