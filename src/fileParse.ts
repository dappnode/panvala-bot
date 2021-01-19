import { readFile } from "fs";
import { ActionIdentity, PanvalaUser, Receipt } from "./types";
import { instanceOfIdentity } from "./utils";

export function getGrain(id: string) {
  const receipts: Receipt[][] = getReceipts();
  const distributions = receipts.map((receipt) =>
    receipt.filter((distribution) => distribution.id === id)
  );
  const distributionsMerged: Receipt[] = ([] as Receipt[]).concat(
    ...distributions
  );
  const totalUserGrain = distributionsMerged.reduce(
    (a, b): Receipt => {
      return {
        amount: (parseInt(a.amount) + parseInt(b.amount)).toString(),
        id: id,
      };
    }
  );
  return totalUserGrain.amount;
}

export function getId(discord: string): string | null {
  const file = readFile();
  const userCreation: ActionIdentity = file.find((line) =>
    instanceOfIdentity(line)
      ? line.action.identity.name === discord
        ? line.action.identity.id
        : null
      : null
  );
  if (userCreation) return userCreation.action.identity.id;
  return null;
}
