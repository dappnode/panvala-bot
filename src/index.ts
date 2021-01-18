import Discord from "discord.js";
import { discordToken } from "./params";
import fs from "fs";
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";

type contentResponse = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"];

async function getFile() {
  const octokit = new Octokit();
  try {
    const response: contentResponse = await octokit.repos.getContent({
      owner: "dappnode",
      repo: "template-instance",
      path: "data/ledger.json",
    });
    // @ts-ignore: Unreachable code error
    const data = response.data.content;
    //console.log(response.data.content);

    const buff = Buffer.from(data, "base64");
    const dataJson = buff.toString("ascii");
    fs.writeFileSync("data.json", dataJson);
    console.log(dataJson);
  } catch (e) {
    console.log(e);
  }
}

getFile();

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
