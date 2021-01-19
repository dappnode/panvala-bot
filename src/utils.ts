import { ActionAlias, ActionIdentity, ActionDistribution } from "./types";

export function instanceOfIdentity(
  object: ActionAlias | ActionIdentity | ActionDistribution
): object is ActionIdentity {
  return (object as ActionIdentity).action.identity !== undefined;
}

export function instanceOfAlias(
  object: ActionAlias | ActionIdentity | ActionDistribution
): object is ActionAlias {
  return (object as ActionAlias).action.alias !== undefined;
}

export function instanceOfDistribution(
  object: ActionAlias | ActionIdentity | ActionDistribution
): object is ActionDistribution {
  return (object as ActionDistribution).action.distribution !== undefined;
}

export const getDate = function () {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};
