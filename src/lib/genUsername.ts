import "server-only";

import { generateUsername } from "unique-username-generator";
import { db } from "./db";

// const filteredAdjectives = adjectives.filter(
//   (a) => !a.includes("sex") || !a.includes("hot")
// );

const genUsername = async () => {
  let usernameExists = true;

  let username = "";

  while (usernameExists) {
    username = generateUsername("_", 4, 30).toLowerCase();

    const userExists = await db.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!userExists) {
      usernameExists = false;
    }
  }

  return username;
};

export default genUsername;
