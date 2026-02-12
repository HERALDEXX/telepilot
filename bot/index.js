require("dotenv").config();
const { Telegraf } = require("telegraf");
const supabase = require("../config/supabase");
const isAdmin = (ctx) => {
  return String(ctx.from.id) === process.env.ADMIN_ID;
};
const { getRandomQuote } = require("../services/quoteService");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  if (ctx.from) {
    await supabase
      .from("users")
      .upsert({ 
        id: ctx.from.id,
        last_active: new Date(), 
      });
  }

  return next();
});

bot.start(async (ctx) => {
  const user = ctx.from;

  const { error } = await supabase.from("users").upsert({
    id: user.id,
    username: user.username || null,
    first_name: user.first_name || null,
  });

  if (error) console.log(error);

  ctx.reply(
    `👋 Welcome to Telepilot\n\n` +
    `⚙️ If I don't reply, I may be offline or under maintenance.\n\n` +
    `Type /help to see available commands`
  );
});

bot.help((ctx) =>
  ctx.reply(
    `🤖 Telepilot Commands\n\n` +
      `/start - start the bot\n` +
      `/help - list commands\n` +
      `/status - check bot availability\n` +
      `/about - bot info\n` +
      `/quote - get a random quote`
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

  const { data: users, error } = await supabase.from("users").select("id");

  if (error) {
    console.log(error);
    return ctx.reply("❌ Failed to fetch users.");
  }

  let success = 0;

  for (const user of users) {
    try {
      await ctx.telegram.sendMessage(user.id, message);
      success++;
    } catch (err) {
      console.log("Failed to send to:", user.id);
    }
  }

  ctx.reply(`📢 Broadcast sent to ${success} users.`);
});

bot.command("stats", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.reply("⛔ Not authorized.");
  }

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) {
    return ctx.reply("❌ Failed to fetch stats.");
  }

  ctx.reply(`📊 Total users: ${count}`);
});

bot.command("active", async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply("⛔ Not authorized.");

  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const { count: active24h } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("last_active", oneDayAgo);

  const { count: active7d } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("last_active", sevenDaysAgo);

  const { count: active30d } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("last_active", thirtyDaysAgo);

  ctx.reply(
    `📈 Activity Stats\n\n` +
      `🟢 Active (24h): ${active24h ?? 0}\n` +
      `🟡 Active (7d): ${active7d ?? 0}\n` +
      `🔵 Active (30d): ${active30d ?? 0}`,
  );
});

bot.command("growth", async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply("⛔ Not authorized.");

  const now = new Date();

  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { count: new24h } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneDayAgo);

  const { count: new7d } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo);

  const { count: new30d } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo);

  ctx.reply(
    `📊 Growth Stats\n\n` +
      `🟢 New (24h): ${new24h ?? 0}\n` +
      `🟡 New (7d): ${new7d ?? 0}\n` +
      `🔵 New (30d): ${new30d ?? 0}`,
  );
});

bot.on("text", (ctx) => {
  ctx.reply(`📩 Received!`);
});

bot.launch({ dropPendingUpdates: true });
console.log("🟢 Telepilot running...");

const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Telepilot running"));
app.listen(process.env.PORT || 3000);
