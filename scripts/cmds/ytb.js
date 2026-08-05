const yts = require("yt-search");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const CACHE = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE)) fs.mkdirSync(CACHE, { recursive: true });

module.exports = {
  config: {
    name: "ytb",
    aliases: ["youtube"],
    version: "1.1.1",
    author: "Christus",
    countDown: 5,
    role: 0,
    category: "media",
    description: {
      en: "Search and download YouTube videos/audios"
    },
    nixPrefix: true,
    guide: {
      en: "   {pn} -v <query> - Download video\n"
        + "   {pn} -a <query> - Download audio\n"
        + "   {pn} -u <url> -v|-a - Download from URL directly"
    }
  },

  onStart: async function ({ sock, chatId, args, event, senderId, reply, prefix, commandName }) {
    const type = args[0]?.toLowerCase();
    if (!type) return reply(`❌ Usage: ${prefix}${commandName} [-v|-a|-u] ...`);

    // --- Téléchargement direct depuis une URL ---
    if (type === "-u") {
      const url = args[1];
      const mode = args[2] || "-v";
      if (!url || !url.startsWith("http")) return reply("❌ Veuillez fournir une URL YouTube valide.");
      if (!["-v", "-a"].includes(mode)) return reply("❌ Précisez -v (vidéo) ou -a (audio) après l'URL.");

      const waitMsg = await sock.sendMessage(chatId, {
        text: `⏳ Téléchargement ${mode === "-v" ? "vidéo" : "audio"} en cours...`
      }, { quoted: event });

      try {
        if (mode === "-a") {
          await downloadAudio(url, sock, chatId, event);
        } else {
          await downloadVideo(url, sock, chatId, event);
        }
        await sock.sendMessage(chatId, { delete: waitMsg.key });
      } catch (e) {
        console.error("[YTB] Download error:", e);
        await sock.sendMessage(chatId, {
          text: "❌ Échec du téléchargement.",
          edit: waitMsg.key
        });
      }
      return;
    }

    // --- Recherche et sélection ---
    if (!["-v", "-a"].includes(type))
      return reply(`❌ Utilisez -v (vidéo) ou -a (audio).\nExemple: ${prefix}${commandName} -v never gonna give you up`);

    const query = args.slice(1).join(" ");
    if (!query) return reply(`❌ Veuillez fournir un terme de recherche.`);

    try {
      const search = await yts(query);
      const results = search.videos.slice(0, 5);
      if (results.length === 0) return reply("❌ Aucun résultat trouvé.");

      // Préparation du message de sélection
      let msg = "🎬 *Résultats de recherche YouTube*\n\n";
      results.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n   ⏱ ${v.timestamp}\n\n`;
      });
      msg += "📩 *Répondez avec le numéro (1-5) pour télécharger.*";

      // Envoi du premier thumbnail avec la légende
      const sent = await sock.sendMessage(chatId, {
        image: { url: results[0].thumbnail },
        caption: msg
      }, { quoted: event });

      // Stockage des données pour onReply
      global.NixBot.onReply.push({
        commandName: "ytb",
        messageID: sent.key.id,
        author: senderId,
        results: results,
        downloadType: type  // "-v" ou "-a"
      });

    } catch (err) {
      console.error("[YTB] Search error:", err);
      return reply("❌ Erreur lors de la recherche : " + err.message);
    }
  },

  onReply: async function ({ sock, chatId, message, senderId, event }) {
    const repliedMsgId = event.message?.extendedTextMessage?.contextInfo?.stanzaId;
    if (!repliedMsgId) return;

    const data = global.NixBot.onReply.find(
      r => r.commandName === "ytb" && r.author === senderId && r.messageID === repliedMsgId
    );
    if (!data) return;

    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
    const index = parseInt(text) - 1;
    if (isNaN(index) || index < 0 || index >= data.results.length) {
      return sock.sendMessage(chatId, { text: "❌ Choix invalide." }, { quoted: event });
    }

    const selected = data.results[index];

    // Supprimer les données pour éviter une seconde utilisation
    const idx = global.NixBot.onReply.findIndex(r => r.messageID === data.messageID);
    if (idx !== -1) global.NixBot.onReply.splice(idx, 1);

    // Supprimer le message de sélection
    try {
      await sock.sendMessage(chatId, {
        delete: {
          remoteJid: chatId,
          fromMe: true,
          id: data.messageID
        }
      });
    } catch (e) {}

    const waitMsg = await sock.sendMessage(chatId, {
      text: `⏳ Téléchargement de "${selected.title}"...`
    }, { quoted: event });

    try {
      if (data.downloadType === "-a") {
        await downloadAudio(selected.url, sock, chatId, event);
      } else {
        await downloadVideo(selected.url, sock, chatId, event);
      }
      await sock.sendMessage(chatId, { delete: waitMsg.key });
    } catch (e) {
      console.error("[YTB] Download error:", e);
      await sock.sendMessage(chatId, {
        text: "❌ Échec du téléchargement.",
        edit: waitMsg.key
      });
    }
  }
};

// ---------- Fonctions de téléchargement ----------
async function downloadVideo(url, sock, chatId, event) {
  // Nouvel endpoint : /api/fahh?url=...&format=mp4
  const apiUrl = `https://downvid.onrender.com/api/fahh?url=${encodeURIComponent(url)}&format=mp4`;
  const { data } = await axios.get(apiUrl);
  if (data.status !== "success" || !data.downloadUrl)
    throw new Error("L'API n'a pas retourné d'URL de téléchargement.");

  const filePath = path.join(CACHE, `vid_${Date.now()}.mp4`);
  await downloadFile(data.downloadUrl, filePath);

  await sock.sendMessage(chatId, {
    video: fs.readFileSync(filePath),
    caption: "🎥 Vidéo téléchargée",
    mimetype: "video/mp4"
  }, { quoted: event });

  fs.unlinkSync(filePath);
}

async function downloadAudio(url, sock, chatId, event) {
  // Nouvel endpoint : /api/fahh?url=...&format=mp3
  const apiUrl = `https://downvid.onrender.com/api/fahh?url=${encodeURIComponent(url)}&format=mp3`;
  const { data } = await axios.get(apiUrl);
  if (data.status !== "success" || !data.downloadUrl)
    throw new Error("L'API n'a pas retourné d'URL de téléchargement.");

  const filePath = path.join(CACHE, `aud_${Date.now()}.mp3`);
  await downloadFile(data.downloadUrl, filePath);

  await sock.sendMessage(chatId, {
    audio: fs.readFileSync(filePath),
    mimetype: "audio/mpeg",
    fileName: "audio.mp3",
    ptt: false
  }, { quoted: event });

  fs.unlinkSync(filePath);
}

async function downloadFile(url, outputPath) {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios.get(url, { responseType: "stream" });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
  }
