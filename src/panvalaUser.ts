import { getId, getGrainEarned } from "./fileParse";
import { PanvalaUser } from "./types";
import { getDate } from "./utils";

/**
 * Creates get PanvalaUser features
 * @param param0
 * @returns PanvalaUser {id, address, discord, grain, time} | user not found
 */
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
    const time = getDate();
    const grain = getGrainEarned(id);
    return {
      id: id,
      address: address,
      discord: discord,
      grainEarned: grain,
      lastGrainEarned: "",
      time: time,
    };
  } else {
    // User does not exist
    throw Error("User was not found");
  }
}
