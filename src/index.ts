import Discord from "discord.js";
import {
  addPanvalaUser,
  changeSheet,
  createSheet,
} from "./google-sheets/google-sheets";
import { discordToken } from "./params/params";
import cron from "node-cron";
import { getFile, writeFile } from "./ledgerFile/fileCreation";
import { getGrainEarned, getId } from "./ledgerFile/fileParse";
import { createPanvalaUser } from "./panvala/panvalaUser";

function main() {
  const user = createPanvalaUser({
    discord: "emansipater",
    address: "0XRFETH",
  });
  console.log(user);
}
main();

process.exit();

/**
 * Rewrites the file after the grain distribution
 */
cron.schedule(
  "6 0 * * 0",
  async () => {
    await getFile();
  },
  { timezone: "Europe/Madrid" }
);

const client = new Discord.Client();
client.login(discordToken);

client.on("ready", () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}!`);
  }
});
client.on("message", async (msg) => {
  try {
    const args = msg.content.split(" ");
    if (args[0] === "!claim" && args.length === 2) {
      const response = await addPanvalaUser({
        discord: msg.author.username,
        address: args[1],
      });
      msg.reply(response);
    } else if (
      (args[0] === "!newSheet" &&
        args.length === 2 &&
        msg.author.username === "pablomendez_95") ||
      "eduadiez (DAppNode)" ||
      "lanski"
    ) {
      const response = await createSheet(args[1]);
      msg.reply(response);
    } else if (
      (args[0] === "!changeSheet" &&
        args.length === 2 &&
        msg.author.username === "pablomendez_95") ||
      "eduadiez (DAppNode)" ||
      "lanski"
    ) {
      const response = await changeSheet(args[1]);
      msg.reply(response);
    } else if (msg.content === "panvala") {
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
}
