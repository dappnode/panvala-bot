import {
  ActionDistribution,
  ContentResponse,
  Distribution,
  Receipt,
} from "./types";
import { instanceOfDistribution } from "./utils";
import fs from "fs";
import { Octokit } from "@octokit/rest";

export function readFile() {
  try {
    const file = fs.readFileSync("./data/ledger.json", "utf-8");
    const fileArr = file.trim().split("\n");
    const fileJson = fileArr.map((line, i) => JSON.parse(line)); //.join("\n");
    return fileJson;
  } catch (e) {
    // error: message, stack
    e.message = `Error when reading data.json: ${e.message}`;
    throw e;
  }
}

export function getReceipts() {
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

  return receiptsMerged;
}

export function writeFile(file: string) {
  const buff = Buffer.from(file, "base64");
  const dataJson = buff.toString("ascii");
  fs.writeFileSync("./data/ledger.json", dataJson);
}

export async function getFile() {
  const octokit = new Octokit();
  try {
    const response: ContentResponse = await octokit.repos.getContent({
      owner: "dappnode",
      repo: "template-instance",
      path: "data/ledger.json",
    });
    // Critical: content response type is wrong || version and date
    const data = (response.data as any).content;
    writeFile(data);
  } catch (e) {
    console.log(e);
  }
}
