import Discord from "discord.js";
import { addPanvalaUser } from "./google-sheets";
import { discordToken } from "./params";

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
    if (args[0] === "!claim") {
      addPanvalaUser({ discord: msg.author.username, address: args[1] });
    } else if (msg.content === "$new$month$") {
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
