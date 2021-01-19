import Discord from "discord.js";
import { create } from "domain";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { getFile } from "./fileCreation";
import { getGrain, getId } from "./fileParse";
import {
  addPanvalaUser,
  changeSheet,
  createSheet,
  doc,
  getSheet,
  loadSheets,
} from "./google-sheets";
import { clientSecretJson, discordToken } from "./params";
import { GoogleSpreadsheetRowResponse } from "./types";

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
