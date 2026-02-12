require("dotenv").config();
const { Telegraf } = require("telegraf");
const supabase = require("../config/supabase");
const isAdmin = (ctx) => {
  return String(ctx.from.id) === process.env.ADMIN_ID;
};
const { getRandomQuote } = require("../services/quoteService");

const bot = new Telegraf(process.env.BOT_TOKEN);

const rateLimit = require("telegraf-ratelimit");

const limitConfig = {
  window: 3000,
  limit: 3,
  onLimitExceeded: (ctx) =>
    ctx.reply("⚠️ You're going a bit fast. Try again in a moment."),
};

bot.use(rateLimit(limitConfig));

bot.use(async (ctx, next) => {
  if (ctx.from) {
    await supabase.from("users").upsert({
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
    `👋 Hey! Welcome to Telepilot.\n\n` +
      `If I go quiet, I might be offline or in maintenance.\n\n` +
      `Type /help to see what I can do.`,
  );
});

bot.help((ctx) =>
  ctx.reply(
    `🤖 Telepilot Commands\n\n` +
      `/start - get started\n` +
      `/help - see commands list\n` +
      `/status - check if I'm online\n` +
      `/about - what this bot is\n` +
      `/quote - grab a random quote`,
  ),
);

bot.command("status", (ctx) => ctx.reply("🟢 All good here. I'm online."));

bot.command("about", (ctx) =>
  ctx.reply(
    `🚀 Telepilot\n` +
      `A Telegram automation bot built with Node.js.\n\n` +
      `More features are on the way.`,
  ),
);

bot.command("quote", async (ctx) => {
  try {
    const quote = await getRandomQuote();
    await ctx.reply(`💬 "${quote.q}"\n\n— ${quote.a}`);
  } catch (err) {
    await ctx.reply(
      "⚠️ I couldn't fetch a quote just now. Please try again soon.",
    );
  }
});

bot.command("broadcast", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.reply("⛔ Sorry, that command is admin-only.");
  }

  const message = ctx.message.text.replace("/broadcast", "").trim();

  if (!message) {
    return ctx.reply("Usage: /broadcast <message>");
  }

  const { data: users, error } = await supabase.from("users").select("id");

  if (error) {
    console.log(error);
    return ctx.reply("❌ I couldn't fetch the user list.");
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

  await supabase.from("logs").insert({
    type: "broadcast",
    user_id: ctx.from.id,
    message: `${message} | sent to ${success} users`,
  });

  ctx.reply(`📢 Broadcast sent to ${success} users.`);
});

bot.command("stats", async (ctx) => {
  if (!isAdmin(ctx)) {
    return ctx.reply("⛔ Sorry, that command is admin-only.");
  }

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (error) {
    return ctx.reply("❌ I couldn't fetch stats right now.");
  }

  ctx.reply(`📊 Total users: ${count}`);
});

bot.command("active", async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply("⛔ Sorry, that command is admin-only.");

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
    `📈 Activity snapshot\n\n` +
      `🟢 Active in last 24h: ${active24h ?? 0}\n` +
      `🟡 Active in last 7d: ${active7d ?? 0}\n` +
      `🔵 Active in last 30d: ${active30d ?? 0}`,
  );
});

bot.command("growth", async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply("⛔ Sorry, that command is admin-only.");

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
    `📊 Growth snapshot\n\n` +
      `🟢 New in last 24h: ${new24h ?? 0}\n` +
      `🟡 New in last 7d: ${new7d ?? 0}\n` +
      `🔵 New in last 30d: ${new30d ?? 0}`,
  );
});

bot.on("text", (ctx) => {
  ctx.reply("✅ Got it! If you need anything specific, try /help.");
});

bot.catch((err, ctx) => {
  console.error("Bot error:", err);

  if (ctx && ctx.reply) {
    ctx.reply("⚠️ Something went wrong. Please try again later.");
  }
});

bot.launch({ dropPendingUpdates: true });
console.log("🟢 Telepilot running...");

const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Telepilot running"));
app.listen(process.env.PORT || 3000);


process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
