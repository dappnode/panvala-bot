import { getId, getGrain } from "./fileParse";
import { PanvalaUser } from "./types";
import { getDate } from "./utils";

export function createPanvalaUser({
  discord,
  address,
}: {
  discord: string;
  address: string;
}): PanvalaUser {
  const id = getId(discord);

  if (id) {
    // User exists
    const grain = getGrain(id);
    const time = getDate();
    return {
      id: id,
      address: address,
      discord: discord,
      grain: grain,
      time: time,
    };
  } else {
    // User does not exist
    throw Error("User was not found");
  }
}

export function checkUserExists() {}
