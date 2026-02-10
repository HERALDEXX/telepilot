require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    `👋 Welcome to Telepilot\n\n` +
      `Available commands:\n` +
      `/help - show commands\n` +
      `/about - what this bot does`,
  ),
);

bot.help((ctx) =>
  ctx.reply(
    `🤖 Telepilot Commands\n\n` +
      `/start - start the bot\n` +
      `/help - list commands\n` +
      `/about - bot info`,
  ),
);

bot.command("about", (ctx) =>
  ctx.reply(
    `🚀 Telepilot\n` +
      `An automation-focused Telegram bot built with Node.js.\n\n` +
      `More features coming soon.`,
  ),
);

bot.on("text", (ctx) => ctx.reply(`📩 Received: ${ctx.message.text}`));

bot.launch();
console.log("Telepilot running...");
