const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "prefix",
    aliases: [],
    version: "1.3",
    author: "۝𝑪𝑯𝑹𝑰𝑺𝑻𝑼𝑺۝",
    countDown: 10,
    role: 0,
    shortDescription: "Affiche ou change le préfixe du bot",
    longDescription: "Permet de voir le préfixe actuel, de le changer pour ce chat ou globalement (admin), de le réinitialiser ou de rafraîchir le cache.",
    category: "config",
    guide: {
      en: "👋 Need help with prefixes? Here's what I can do:\n" +
        "╰‣ Type: {pn} <newPrefix>\n" +
        "   ↪ Set a new prefix for this chat only\n" +
        "   ↪ Example: {pn} $\n" +
        "╰‣ Type: {pn} <newPrefix> -g\n" +
        "   ↪ Set a new global prefix (admin only)\n" +
        "   ↪ Example: {pn} ! -g\n" +
        "╰‣ Type: {pn} reset\n" +
        "   ↪ Reset to default prefix from config\n" +
        "╰‣ Type: {pn} refresh\n" +
        "   ↪ Refresh prefix cache for this chat\n" +
        "╰‣ Just type: prefix\n" +
        "   ↪ Shows current prefix info\n" +
        "🤖 I'm ۝𝑪𝑯𝑹𝑰𝑺𝑻𝑼𝑺۝, ready to help!"
    },
    nixPrefix: true
  },

  onStart: async function ({ sock, chatId, event, args, senderId, usersData, reply, role }) {
    const globalPrefix = global.NixBot.config.prefix;
    const userName = event.pushName || (await usersData.get(senderId)).name || "there";

    let threadPrefix = globalPrefix;
    if (global.NixBot.threadConfig && global.NixBot.threadConfig.has(chatId)) {
      threadPrefix = global.NixBot.threadConfig.get(chatId).prefix || globalPrefix;
    }

    if (!args[0]) {
      return sock.sendMessage(chatId, {
        text: `👋 Hey ${userName}, did you ask for my prefix?\n` +
              `╭‣ 🌐 Global: ${globalPrefix}\n` +
              `╰‣ 💬 This Chat: ${threadPrefix}\n` +
              `🤖 I'm ۝𝑪𝑯𝑹𝑰𝑺𝑻𝑼𝑺۝\n📂 try "${threadPrefix}help" to see all commands.`
      }, { quoted: event });
    }

    if (args[0] === "reset") {
      if (global.NixBot.threadConfig && global.NixBot.threadConfig.has(chatId)) {
        global.NixBot.threadConfig.delete(chatId);
      }
      return sock.sendMessage(chatId, {
        text: `✅ Hey ${userName}, chat prefix has been reset!\n` +
              `╭‣ 🌐 Global: ${globalPrefix}\n` +
              `╰‣ 💬 This Chat: ${globalPrefix}\n` +
              `🤖 I'm ۝𝑪𝑯𝑹𝑰𝑺𝑻𝑼𝑺۝\n📂 try "${globalPrefix}help" to see all commands.`
      }, { quoted: event });
    }

    if (args[0] === "refresh") {
      const refreshedPrefix = threadPrefix;
      return sock.sendMessage(chatId, {
        text: `🔄 Hey ${userName}, prefix cache has been refreshed!\n` +
              `╭‣ 🌐 Global: ${globalPrefix}\n` +
              `╰‣ 💬 This Chat: ${refreshedPrefix}\n` +
              `🤖 I'm ۝𝑪𝑯𝑹𝑰𝑺𝑻𝑼𝑺۝\n📂 try "${refreshedPrefix}help" to see all commands.`
      }, { quoted: event });
    }

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (setGlobal) {
      if (role < 2) {
        return sock.sendMessage(chatId, {
          text: `⛔ Hey ${userName}, Admin privileges required for global change!`
        }, { quoted: event });
      }
    }

    const confirmMsg = setGlobal
      ? `⚙️ Hey ${userName}, confirm global prefix change?\n╭‣ Current: ${globalPrefix}\n╰‣ New: ${newPrefix}\n🤖 React to confirm!`
      : `⚙️ Hey ${userName}, confirm chat prefix change?\n╭‣ Current: ${threadPrefix}\n╰‣ New: ${newPrefix}\n🤖 React to confirm!`;

    const sentMsg = await sock.sendMessage(chatId, { text: confirmMsg }, { quoted: event });

    if (!global.NixBot.onReaction) global.NixBot.onReaction = new Map();
    global.NixBot.onReaction.set(sentMsg.key.id, {
      author: senderId,
      newPrefix,
      setGlobal,
      chatId
    });
  },

  onChat: async function ({ sock, chatId, event, senderId, usersData }) {
    const body = (event.message?.conversation || event.message?.extendedTextMessage?.text || "").toLowerCase().trim();
    if (!body) return;

    const triggers = ["prefix", "ňč", "nøøbcore"];
    if (!triggers.includes(body)) return;

    const globalPrefix = global.NixBot.config.prefix;
    const userName = event.pushName || (await usersData.get(senderId)).name || "there";
    let threadPrefix = globalPrefix;
    if (global.NixBot.threadConfig && global.NixBot.threadConfig.has(chatId)) {
      threadPrefix = global.NixBot.threadConfig.get(chatId).prefix || globalPrefix;
    }

    await sock.sendMessage(chatId, {
      text: `👋 Hey ${userName}, did you ask for my prefix?\n` +
            `╭‣ 🌐 Global: ${globalPrefix}\n` +
            `╰‣ 💬 This Chat: ${threadPrefix}\n` +
            `🤖 I'm ۝𝑪𝑯𝑹𝑰𝑺𝑻𝑼𝑺۝\n📂 try "${threadPrefix}help" to see all commands.`
    }, { quoted: event });
  },

  onReaction: async function ({ sock, event, usersData }) {
    const messageId = event.message?.reactionMessage?.key?.id || event.key?.id;
    if (!messageId) return;

    const reactionData = global.NixBot.onReaction?.get(messageId);
    if (!reactionData) return;

    const { author, newPrefix, setGlobal, chatId } = reactionData;
    const reactor = event.key.participant || event.key.remoteJid;

    if (reactor !== author) return;

    const userName = event.pushName || (await usersData.get(author)).name || "there";

    if (setGlobal) {
      global.NixBot.config.prefix = newPrefix;
      try {
        const configPath = path.join(process.cwd(), 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        config.prefix = newPrefix;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        await sock.sendMessage(chatId, {
          text: `✅ Hey ${userName}, global prefix updated to: ${newPrefix}`
        });
      } catch (err) {
        await sock.sendMessage(chatId, {
          text: `❌ Failed to save global prefix config.`
        });
      }
    } else {
      if (!global.NixBot.threadConfig) global.NixBot.threadConfig = new Map();
      global.NixBot.threadConfig.set(chatId, { prefix: newPrefix });
      await sock.sendMessage(chatId, {
        text: `✅ Hey ${userName}, chat prefix updated to: ${newPrefix}`
      });
    }

    global.NixBot.onReaction.delete(messageId);
  }
};
