export const APP_NAME = "link vault";

export const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
    : process.env.NEXT_PUBLIC_BASE_URL;

// FORGOT PASSWORD TOKEN
export const FORGOT_PASSWORD_TOKEN_LENGTH = 124;

export const LINK_TITLE_MAX_LENGTH = 100;
export const LINK_DESCRIPTION_MAX_LENGTH = 150;
export const CATEGORY_NAME_MAX_LENGTH = 80;
export const SUB_CATEGORY_NAME_MAX_LENGTH = 80;

export const PAGINATION_LIMIT = 20;
