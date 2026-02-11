require("dotenv").config();
const { Telegraf } = require("telegraf");
const isAdmin = (ctx) => {
  return String(ctx.from.id) === process.env.ADMIN_ID;
};
const { getRandomQuote } = require("../services/quoteService");

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
      `/about - bot info\n` +
      `/quote - get a random quote`,
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

bot.command("quote", async (ctx) => {
  try {
    const quote = await getRandomQuote();
    await ctx.reply(`💬 "${quote.q}"\n\n— ${quote.a}`);
  } catch (err) {
    await ctx.reply("⚠️ Could not fetch quote. Try again later.");
  }
});

bot.command("broadcast", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.reply("⛔ You are not authorized to use this command.");
  }

  const message = ctx.message.text.replace("/broadcast", "").trim();

  if (!message) {
    return ctx.reply("Usage: /broadcast your message here");
  }

  // For now, just confirm
  ctx.reply(`📢 Broadcast sent:\n\n${message}`);
});

bot.on("text", (ctx) => ctx.reply(`📩 Received: ${ctx.message.text}`));

bot.launch();
console.log("🟢 Telepilot running...");

const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Telepilot running"));
app.listen(process.env.PORT || 3000);
