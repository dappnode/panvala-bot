import {
  ActionDistribution,
  ContentResponse,
  Distribution,
  Receipt,
} from "../types/types";
import { instanceOfDistribution } from "../utils";
import fs from "fs";
import { Octokit } from "@octokit/rest";

/**
 * Reads syncrounusly the ledger.json
 * @returns file in json format
 */
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

/**
 * Writes the file in the same format as in the remote repo
 * @param file in string format
 */
export function writeFile(file: string) {
  const buff = Buffer.from(file, "base64");
  const dataJson = buff.toString("ascii");
  fs.writeFileSync("./data/ledger.json", dataJson);
}

/**
 * Get single file ledger.json from repo
 * Calls writeFIle at the end
 */
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
