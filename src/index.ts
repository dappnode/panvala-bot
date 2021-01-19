import Discord from "discord.js";
import { discordToken } from "./params";
import fs from "fs";
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import { compile, compileFromFile } from "json-schema-to-typescript";
import {
  ActionAlias,
  ActionDistribution,
  ActionIdentity,
  Distribution,
  PanvalaUser,
  Receipt,
} from "./types";
import { parse } from "dotenv/types";

type ContentResponse = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"];

async function getFile() {
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

function writeFile(file: string) {
  const buff = Buffer.from(file, "base64");
  const dataJson = buff.toString("ascii");
  fs.writeFileSync("data.json", dataJson);
}

function readFile() {
  try {
    const file = fs.readFileSync("./data.json", "utf-8");
    const fileArr = file.trim().split("\n");
    const fileJson = fileArr.map((line, i) => JSON.parse(line)); //.join("\n");
    return fileJson;
  } catch (e) {
    // error: message, stack
    e.message = `Error when reading data.json: ${e.message}`;
    throw e;
  }
}

function getReceipts() {
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

function registerUser(user: PanvalaUser) {}

function createUser({
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
    return {
      id: id,
      address: address,
      discord: discord,
      grain: grain,
    };
  } else {
    // User does not exist
    throw Error("User was not found");
  }
}

function getGrain(id: string) {
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

const grain = getGrain("swQm7i0bz6wumzAs8ZNteQ");
console.log(grain);

function instanceOfIdentity(
  object: ActionAlias | ActionIdentity | ActionDistribution
): object is ActionIdentity {
  return (object as ActionIdentity).action.identity !== undefined;
}

function instanceOfAlias(
  object: ActionAlias | ActionIdentity | ActionDistribution
): object is ActionAlias {
  return (object as ActionAlias).action.alias !== undefined;
}

function instanceOfDistribution(
  object: ActionAlias | ActionIdentity | ActionDistribution
): object is ActionDistribution {
  return (object as ActionDistribution).action.distribution !== undefined;
}

function getId(discord: string): string | null {
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

/* const client = new Discord.Client();
client.login(discordToken);

client.on("ready", () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}!`);
  }
});
client.on("message", async (msg) => {
  try {
    const args = msg.content.split(" ");
    if (msg.content === "ping") {
      msg.reply("hey DappNodeTeam! you should go back to work...");
    } else {
      return 1;
    }
  } catch (e) {
    console.log(e);
    msg.reply(e.message);
  }
});

export async function connectionDiscord() {
  client.login(discordToken);

  client.on("ready", () => {
    if (client.user) {
      console.log(`Logged in as ${client.user.tag}!`);
      return;
    }
  });
} */
