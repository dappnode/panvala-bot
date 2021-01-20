import { readFile } from "./fileCreation";
import {
  ActionDistribution,
  ActionIdentity,
  Distribution,
  PanvalaUser,
  Receipt,
} from "../types/types";
import { instanceOfDistribution, instanceOfIdentity } from "../utils";

/**
 * Parse the ledger.json to obtain all grain distributions
 * of a specific user
 * @param id
 * @returns total grain of the user
 */
export function getGrainEarned(id: string): string {
  const distributionsMerged: Receipt[] = getReceipts(id);

  const totalUserGrain = distributionsMerged.reduce(
    (acumulator, currentValue) => {
      return acumulator + parseInt(currentValue.amount);
    },
    0
  );
  return totalUserGrain.toString();
}

export function getLastGrainEarned(id: string): string {
  const distributionsMerged: Receipt[] = getReceipts(id);
  // Each distribution contains two Receipts (not sure)
  // The last two receipts will belong to the last distribution
  const lastDistribution = distributionsMerged.slice(
    distributionsMerged.length - 2,
    distributionsMerged.length
  );

  const userDistributionsMerged: Receipt[] = ([] as Receipt[]).concat(
    ...lastDistribution
  );

  const lastUserGrain = userDistributionsMerged.reduce(
    (acumulator, currentValue) => {
      return acumulator + parseInt(currentValue.amount);
    },
    0
  );
  return lastUserGrain.toString();
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

/**
 * Parses the file to obtain distributions
 * @returns array of distributions to calculate total user grain
 */
export function getReceipts(id: string): Receipt[] {
  const file = readFile();
  const distributions: ActionDistribution[] = file.filter((line) =>
    instanceOfDistribution(line)
  );
  const allocations: Distribution[][] = distributions.map(
    (distribution) => distribution.action.distribution.allocations
  );

  const receipts: Receipt[][][] = allocations.map((distributions) =>
    distributions.map((distribution) => distribution.receipts)
  );

  const receiptsMerged = ([] as Receipt[][]).concat(...receipts);

  const userDistributions = receiptsMerged.map((receipt) =>
    receipt.filter((distribution) => distribution.id === id)
  );
  const distributionsMerged: Receipt[] = ([] as Receipt[]).concat(
    ...userDistributions
  );

  return distributionsMerged;
}
