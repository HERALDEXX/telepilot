require("dotenv").config();
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    `👋 Welcome to Telepilot\n\n` +
      `⚙️ If I don't reply, I may be offline or under maintenance.\n\n` +
      `Type /help to see available commands`,
  ),
);

bot.help((ctx) =>
  ctx.reply(
    `🤖 Telepilot Commands\n\n` +
      `/start - start the bot\n` +
      `/help - list commands\n` +
      `/status - check bot availability\n` +
      `/about - bot info`,
  ),
);

bot.command("status", (ctx) => ctx.reply("🟢 Telepilot is online and running"));

bot.command("about", (ctx) =>
  ctx.reply(
    `🚀 Telepilot\n` +
      `An automation-focused Telegram bot built with Node.js.\n\n` +
      `More features coming soon.`,
  ),
);

bot.on("text", (ctx) => ctx.reply(`📩 Received: ${ctx.message.text}`));

bot.launch();
console.log("🟢 Telepilot running...");
