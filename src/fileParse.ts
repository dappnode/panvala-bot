import { getReceipts, readFile } from "./fileCreation";
import { ActionIdentity, PanvalaUser, Receipt } from "./types";
import { instanceOfIdentity } from "./utils";

/**
 * Parse the ledger.json to obtain all grain distributions
 * to a specific user
 * @param id
 * @returns total grain of the user
 */
export function getGrainEarned(id: string): string {
  const receipts: Receipt[][] = getReceipts();
  const distributions = receipts.map((receipt) =>
    receipt.filter((distribution) => distribution.id === id)
  );
  const distributionsMerged: Receipt[] = ([] as Receipt[]).concat(
    ...distributions
  );
  console.log(distributionsMerged);
  const totalUserGrain = distributionsMerged.reduce(
    (acumulator, currentValue) => {
      return acumulator + parseInt(currentValue.amount);
    },
    0
  );
  return totalUserGrain.toString();
}

/**
 * Parses ledger.json to obtain the id from a discord user
 * @param discord
 * @returns user ID specified in the ledger.json
 */
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
