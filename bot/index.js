const { Telegraf } = require("telegraf");
const { BOT_TOKEN } = require("../config/env");

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply("Bot is alive 🚀"));

bot.on("text", (ctx) => {
  console.log(ctx.message.text);
});

bot.launch();
