const axios = require('axios');

const BASE_URL = 'https://quiz-api-zd8a.onrender.com/api';

module.exports = {
  config: {
    name: "quiz",
    aliases: ["q"],
    version: "4.0",
    author: "Christus",
    countDown: 0,
    role: 0,
    description: {
      en: "Jeu de quiz avancé avec 6000+ questions, images, succès et classements"
    },
    category: "game",
    guide: {
      en: `{pn} <catégorie>\n\n📚 Catégories disponibles :\n🎌 anime, 🏁 flag, 📺 cartoon, 🐾 animaux, 🏛️ monument, ⚽ sport, 🔬 science, 📖 histoire, 🎬 cinema, 🌍 geographie, ➗ maths, 🎭 culture, ⚖️ torf`
    }
  },

  langs: {
    en: {
      reply: "🎯 𝗤𝘂𝗶𝘇 𝗖𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲\n━━━━━━━━━━\n\n📚 𝖢𝖺𝗍é𝗀𝗈𝗋𝗂𝖾: {category}\n🎚️ 𝖣𝗂𝖿𝖿𝗂𝖼𝗎𝗅𝗍é: {difficulty}\n❓ 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: {question}\n\n{options}\n\n⏰ 𝖵𝗈𝗎𝗌 𝖺𝗏𝖾𝗓 30 𝗌𝖾𝖼𝗈𝗇𝖽𝖾𝗌 𝗉𝗈𝗎𝗋 𝖺𝗇𝗌𝗐𝖾𝗋𝗌 (A/B/C/D):",
      torfReply: "⚙ 𝗤𝘂𝗶𝘇 ( Vrai/Faux )\n━━━━━━━━━━\n\n💭 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: {question}\n\n😆: Vrai\n😮: Faux\n\nRéagissez avec les émojis\n⏰ 30 secondes pour répondre",
      correctMessage: "🎉 𝗕𝗼𝗻𝗻𝗲 𝗿é𝗽𝗼𝗻𝘀𝗲 !\n━━━━━━━━━━\n\n✅ 𝖲𝖼𝗈𝗋𝖾: {correct}/{total}\n🏆 𝖯𝗋é𝖼𝗂𝗌𝗂𝗈𝗇: {accuracy}%\n🔥 𝖲é𝗋𝗂𝖾 𝖾𝗇 𝖼𝗈𝗎𝗋𝗌: {streak}\n⚡ 𝖳𝖾𝗆𝗉𝗌 𝖽𝖾 𝖿é𝗉𝗈𝗇𝗌𝖾: {time}s\n🎯 𝖷𝖯 𝖦𝖺𝗂𝗇é: +{xp}\n💰 𝖠𝗋𝗀𝖾𝗇𝗍 𝗀𝖺𝗀𝗇é: +{money}",
      wrongMessage: "❌ 𝗠𝗮𝘂𝘃𝗮𝗶𝘀𝗲 𝗿é𝗽𝗼𝗻𝘀𝗲\n━━━━━━━━━━\n\n🎯 𝖡𝗈𝗇𝗇𝖾 𝗋é𝗉𝗈𝗇𝗌𝖾: {correctAnswer}\n📊 𝖲𝖼𝗈𝗋𝖾: {correct}/{total}\n📈 𝖯𝗋é𝖼𝗂𝗌𝗂𝗈𝗇: {accuracy}%\n💔 𝖲é𝗋𝗂𝖾 𝗋é𝗂𝗇𝗂𝗍𝗂𝖺𝗅𝗂𝗌é𝖾",
      timeoutMessage: "⏰ 𝖳𝖾𝗆𝗉𝗌 é𝖼𝗈𝗎𝗅é ! 𝖡𝗈𝗇𝗇𝖾 𝗋é𝗉𝗈𝗇𝗌𝖾: {correctAnswer}",
      achievementUnlocked: "🏆 𝗦𝘂𝗰𝗰è𝘀 𝗱é𝗯𝗹𝗼𝗾𝘂é !\n{achievement}\n💰 +{bonus} pièces bonus !"
    }
  },

  async safeStream(url) {
    if (!url || !/^https?:\/\//i.test(url)) return null;
    try {
      const res = await axios.get(url, {
        responseType: "stream",
        timeout: 20000,
        maxRedirects: 5,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
          Referer: "https://www.google.com/"
        }
      });
      const ext = (url.split("?")[0].split(".").pop() || "jpg").slice(0, 4);
      res.data.path = `quiz_${Date.now()}.${ext}`;
      return res.data;
    } catch (e) {
      console.error("Échec du téléchargement de l'image:", url, e.message);
      return null;
    }
  },

  generateProgressBar(percentile) {
    const filled = Math.round(percentile / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  },

  getUserTitle(correct) {
    if (correct >= 50000) return '🌟 Quiz Omniscient';
    if (correct >= 25000) return '👑 Quiz Divinité';
    if (correct >= 15000) return '⚡ Quiz Titan';
    if (correct >= 10000) return '🏆 Quiz Légende';
    if (correct >= 7500) return '🎓 Grand Maître';
    if (correct >= 5000) return '👨‍🎓 Maître du Quiz';
    if (correct >= 2500) return '🔥 Expert Quiz';
    if (correct >= 1500) return '📚 Savant Quiz';
    if (correct >= 1000) return '🎯 Apprenti Quiz';
    if (correct >= 750) return '🌟 Chercheur de Connaissances';
    if (correct >= 500) return '📖 Apprenant Rapide';
    if (correct >= 250) return '🚀 Étoile Montante';
    if (correct >= 100) return '💡 Débutant';
    if (correct >= 50) return '🎪 Premiers Pas';
    if (correct >= 25) return '🌱 Nouveau Venu';
    if (correct >= 10) return '🔰 Débutant';
    if (correct >= 1) return '👶 Recrue';
    return '🆕 Nouveau Joueur';
  },

  async getUserName(event) {
    // Utilisation des propriétés de Baileys / Nix pour récupérer le nom
    return event.pushName || 'Joueur Anonyme';
  },

  async getAvailableCategories() {
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      return res.data.map(cat => cat.toLowerCase());
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      return [];
    }
  },

  onStart: async function ({ sock, chatId, args, event, senderId, commandName, getLang, usersData }) {
    try {
      const command = args[0]?.toLowerCase();

      if (!args[0] || command === "help") {
        return await this.handleDefaultView({ sock, chatId, event, getLang });
      }

      switch (command) {
        case "rank":
        case "profile":
          return await this.handleRank({ sock, chatId, event, senderId, usersData });
        case "leaderboard":
        case "lb":
          return await this.handleLeaderboard({ sock, chatId, args, event });
        case "category":
          if (args.length > 1) {
            return await this.handleCategoryLeaderboard({ sock, chatId, args, event });
          }
          return await this.handleCategories({ sock, chatId, event });
        case "daily":
          return await this.handleDailyChallenge({ sock, chatId, event, senderId, commandName });
        case "torf":
          return await this.handleTrueOrFalse({ sock, chatId, event, senderId, commandName });
        case "flag":
          return await this.handleFlagQuiz({ sock, chatId, event, senderId, commandName });
        case "anime":
          return await this.handleAnimeQuiz({ sock, chatId, event, senderId, commandName });
        case "cartoon":
        case "dessin":
        case "dessins":
        case "kids":
          return await this.handleImageQuiz({ sock, chatId, event, senderId, commandName, category: "cartoon", title: "📺 𝗤𝘂𝗶𝘇 𝗗𝗲𝘀𝘀𝗶𝗻𝘀 𝗔𝗻𝗶𝗺é𝘀" });
        case "animaux":
        case "animal":
          return await this.handleImageQuiz({ sock, chatId, event, senderId, commandName, category: "animaux", title: "🐾 𝗤𝘂𝗶𝘇 𝗔𝗻𝗶𝗺𝗮𝘂𝘅" });
        case "monument":
        case "monuments":
          return await this.handleImageQuiz({ sock, chatId, event, senderId, commandName, category: "monument", title: "🏛️ 𝗤𝘂𝗶𝘇 𝗠𝗼𝗻𝘂𝗺𝗲𝗻𝘁𝘀" });
        case "sport":
        case "sports":
          return await this.handleImageQuiz({ sock, chatId, event, senderId, commandName, category: "sport", title: "⚽ 𝗤𝘂𝗶𝘇 𝗦𝗽𝗼𝗿𝘁" });
        case "cinema":
        case "film":
        case "films":
          return await this.handleImageQuiz({ sock, chatId, event, senderId, commandName, category: "cinema", title: "🎬 𝗤𝘂𝗶𝘇 𝗖𝗶𝗻é𝗺𝗮" });
        case "hard":
          return await this.handleQuiz({ sock, chatId, event, args: ["general"], senderId, commandName, getLang, forcedDifficulty: "hard" });
        case "medium":
          return await this.handleQuiz({ sock, chatId, event, args: ["general"], senderId, commandName, getLang, forcedDifficulty: "medium" });
        case "easy":
          return await this.handleQuiz({ sock, chatId, event, args: ["general"], senderId, commandName, getLang, forcedDifficulty: "easy" });
        case "random":
          return await this.handleQuiz({ sock, chatId, event, args: [], senderId, commandName, getLang });
        default:
          const categories = await this.getAvailableCategories();
          if (categories.includes(command)) {
            return await this.handleQuiz({ sock, chatId, event, args: [command], senderId, commandName, getLang });
          } else {
            return await this.handleDefaultView({ sock, chatId, event, getLang });
          }
      }
    } catch (err) {
      console.error("Erreur de démarrage du quiz:", err);
      return sock.sendMessage(chatId, { text: "⚠️ Une erreur est survenue, réessayez." }, { quoted: event });
    }
  },

  async handleDefaultView({ sock, chatId, event }) {
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      const categories = res.data;

      const catText = categories.map(c => {
        const icons = {
          anime: '🎌', flag: '🏁', cartoon: '📺', animaux: '🐾',
          monument: '🏛️', sport: '⚽', science: '🔬', histoire: '📖',
          cinema: '🎬', geographie: '🌍', maths: '➗', culture: '🎭',
          torf: '⚖️', general: '🎯'
        };
        return `${icons[c] || '📍'} ${c.charAt(0).toUpperCase() + c.slice(1)}`;
      }).join("\n");

      const text = `🎯 𝗤𝘂𝗶𝘇\n━━━━━━━━\n\n` +
        `📚 𝗖𝗮𝘁é𝗴𝗼𝗿𝗶𝗲𝘀 (${categories.length})\n\n${catText}\n\n` +
        `━━━━━━━━━\n\n` +
        `🏆 𝗨𝘁𝗶𝗹𝗶𝘀𝗮𝘁𝗶𝗼𝗻\n` +
        `• quiz rank - Voir votre classement\n` +
        `• quiz leaderboard - Voir le classement global\n` +
        `• quiz torf - Jouer au quiz Vrai/Faux\n` +
        `• quiz flag - Jouer au quiz des drapeaux\n` +
        `• quiz anime - Jouer au quiz anime\n` +
        `• quiz cartoon - Jouer au quiz dessins animés\n` +
        `• quiz animaux - Jouer au quiz animaux\n` +
        `• quiz monument - Jouer au quiz monuments\n` +
        `• quiz sport - Jouer au quiz sport\n\n` +
        `🎮 Utilisez: quiz <catégorie> pour commencer le quiz`;

      return sock.sendMessage(chatId, { text }, { quoted: event });
    } catch (err) {
      console.error("Erreur de la vue par défaut:", err);
      return sock.sendMessage(chatId, { text: "⚠️ Impossible de récupérer les catégories. Essayez 'quiz help' pour les commandes." }, { quoted: event });
    }
  },

  async handleRank({ sock, chatId, event, senderId, usersData }) {
    try {
      const userName = await this.getUserName(event);

      await axios.post(`${BASE_URL}/user/update`, {
        userId: senderId,
        name: userName
      });

      const res = await axios.get(`${BASE_URL}/user/${senderId}`);
      const user = res.data;

      if (!user || user.total === 0) {
        return sock.sendMessage(chatId, { text: `❌ Vous n'avez pas encore joué de quiz ! Utilisez 'quiz random' pour commencer.\n👤 Bienvenue, ${userName} !` }, { quoted: event });
      }

      const position = user.position ?? "N/A";
      const totalUser = user.totalUsers ?? "N/A";
      const progressBar = this.generateProgressBar(user.percentile ?? 0);
      const title = this.getUserTitle(user.correct || 0);

      const streakInfo = user.currentStreak > 0 ? 
        `🔥 𝖲é𝗋𝗂𝖾 𝖾𝗇 𝖼𝗈𝗎𝗋𝗌: ${user.currentStreak}${user.currentStreak >= 5 ? ' 🚀' : ''}` :
        `🔥 𝖲é𝗋𝗂𝖾 𝖾𝗇 𝖼𝗈𝗎𝗋𝗌: 0`;

      const bestStreakInfo = user.bestStreak > 0 ?
        `🏅 𝖬𝖾𝗂𝗅𝗅𝖾𝗎𝗋𝖾 𝗌é𝗋𝗂𝖾: ${user.bestStreak}${user.bestStreak >= 10 ? ' 👑' : user.bestStreak >= 5 ? ' ⭐' : ''}` :
        `🏅 𝖬𝖾𝗂𝗅𝗅𝖾𝗎𝗋𝖾 𝗌é𝗋𝗂𝖾: 0`;

      // Adapter si Nix utilise une structure de DB différente
      let userMoney = 0;
      if (usersData) {
         const userData = await usersData.get(senderId) || {};
         userMoney = userData.money || 0;
      }

      const currentXP = user.xp ?? 0;
      const xpTo1000 = Math.max(0, 1000 - currentXP);
      const xpProgress = Math.min(100, (currentXP / 1000) * 100);
      const xpProgressBar = this.generateProgressBar(xpProgress);

      const text = `🎮 𝗣𝗿𝗼𝗳𝗶𝗹 𝗤𝘂𝗶𝘇\n━━━━━━━━━\n\n` +
        `👤 ${userName}\n` +
        `🎖️ ${title}\n` +
        `🏆 𝖢𝗅𝖺𝗌𝗌𝖾𝗆𝖾𝗇𝗍 𝗀𝗅𝗈𝖻𝖺𝗅: #${position}/${totalUser}\n` +
        `📈 𝖯𝖾𝗋𝖼𝖾𝗇𝗍𝗂𝗅𝖾: ${progressBar} ${user.percentile ?? 0}%\n\n` +
        `📊 𝗦𝘁𝗮𝘁𝗶𝘀𝘁𝗶𝗾𝘂𝗲𝘀\n` +
        `✅ 𝖡𝗈𝗇𝗇𝖾𝗌 𝗋é𝗉𝗈𝗇𝗌𝖾𝗌: ${user.correct ?? 0}\n` +
        `❌ 𝖬𝖺𝗎𝗏𝖺𝗂𝗌𝖾𝗌 𝗋é𝗉𝗈𝗇𝗌𝖾𝗌: ${user.wrong ?? 0}\n` +
        `📝 𝖳𝗈𝗍𝖺𝗅: ${user.total ?? 0}\n` +
        `🎯 𝖯𝗋é𝖼𝗂𝗌𝗂𝗈𝗇: ${user.accuracy ?? 0}%\n` +
        `⚡ 𝖳𝖾𝗆𝗉𝗌 𝗆𝗈𝗒𝖾𝗇 𝗇𝖾 𝗋é𝗉𝗈𝗇𝗌𝖾: ${(user.avgResponseTime ?? 0).toFixed(1)}s\n\n` +
        `💰 𝗥𝗶𝗰𝗵𝗲𝘀𝘀𝗲 & 𝗫𝗣\n` +
        `💵 𝖠𝗋𝗀𝖾𝗇𝗍: ${userMoney.toLocaleString()}\n` +
        `✨ 𝖷𝖯: ${currentXP}/1000\n` +
        `🎯 𝖷𝖯 𝗋𝖾𝗌𝗍𝖺𝗇𝗍 𝗉𝗈𝗎𝗋 1000: ${xpTo1000}\n` +
        `${xpProgressBar} ${xpProgress.toFixed(1)}%\n\n` +
        `🔥 𝗜𝗻𝗳𝗼 𝘀é𝗿𝗶𝗲\n` +
        `${streakInfo}\n` +
        `${bestStreakInfo}\n\n` +
        `🎯 𝖯𝗋𝗈𝖼𝗁𝖺𝗂𝗇 𝗈𝖻𝗃𝖾𝖼𝗍𝗂𝖿: ${user.nextMilestone || "Continuez à jouer !"}`;

      return sock.sendMessage(chatId, { text }, { quoted: event });
    } catch (err) {
      console.error("Erreur de classement:", err);
      return sock.sendMessage(chatId, { text: "⚠️ Impossible de récupérer le classement. Réessayez plus tard." }, { quoted: event });
    }
  },

  async handleLeaderboard({ sock, chatId, args, event }) {
    try {
      const page = parseInt(args?.[0]) || 1;
      const sortBy = args?.[1] || 'correct';

      const res = await axios.get(`${BASE_URL}/leaderboards?page=${page}&limit=8`);
      const { rankings, stats, pagination } = res.data;

      if (!rankings || rankings.length === 0) {
        return sock.sendMessage(chatId, { text: "🏆 Aucun joueur dans le classement. Commencez à jouer pour être le premier !" }, { quoted: event });
      }

      const now = new Date();
      const currentDate = now.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
      });
      const currentTime = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC'
      });

      const players = await Promise.all(rankings.map(async (u, i) => {
        let userName = u.name || 'Joueur Anonyme';

        const position = (pagination.currentPage - 1) * 8 + i + 1;
        const crown = position === 1 ? "👑" : position === 2 ? "🥈" : position === 3 ? "🥉" : position <= 10 ? "🏅" : "🎯";
        const title = this.getUserTitle(u.correct || 0);

        const level = u.level ?? Math.floor((u.correct || 0) / 50) + 1;
        const xp = u.xp ?? (u.correct || 0) * 10;
        const accuracy = u.accuracy ?? (u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0);
        const avgResponseTime = typeof u.avgResponseTime === 'number' ? `${u.avgResponseTime.toFixed(2)}s` : 'N/A';
        
        return `${crown} #${position} ${userName}\n` +
               `🎖️ ${title} | 🌟 Nv.${level} | ✨ XP: ${xp.toLocaleString()}\n` +
               `📊 ${u.correct} ✅ / ${u.wrong} ❌ (Précision: ${accuracy}%)\n` +
               `🔥 Série actuelle: ${u.currentStreak || 0} | ⚡ Temps moyen: ${avgResponseTime}`;
      }));

      const text = `🏆 𝗖𝗹𝗮𝘀𝘀𝗲𝗺𝗲𝗻𝘁 𝗴𝗹𝗼𝗯𝗮𝗹\n━━━━━━━━━\n\n` +
        `📅 ${currentDate}\n⏰ ${currentTime} UTC\n\n` +
        `━━━━━━━━━\n\n${players.join('\n\n')}\n\n` +
        `📖 Page ${pagination?.currentPage || 1}/${pagination?.totalPages || 1} | 👥 Total utilisateurs: ${stats?.totalUsers || 0}`;

      return sock.sendMessage(chatId, { text }, { quoted: event });
    } catch (err) {
      console.error("Erreur du classement:", err);
      return sock.sendMessage(chatId, { text: "⚠️ Impossible de récupérer le classement. Le serveur est peut-être occupé, réessayez plus tard." }, { quoted: event });
    }
  },

  async handleCategories({ sock, chatId, event }) {
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      const categories = res.data;

      const icons = {
        anime: '🎌', flag: '🏁', cartoon: '📺', animaux: '🐾',
        monument: '🏛️', sport: '⚽', science: '🔬', histoire: '📖',
        cinema: '🎬', geographie: '🌍', maths: '➗', culture: '🎭',
        torf: '⚖️', general: '🎯'
      };

      const catText = categories.map(c => 
        `${icons[c] || '📍'} ${c.charAt(0).toUpperCase() + c.slice(1)}`
      ).join("\n");

      const text = `📚 𝗖𝗮𝘁é𝗴𝗼𝗿𝗶𝗲𝘀 𝗱𝘂 𝗤𝘂𝗶𝘇 (${categories.length})\n━━━━━━━━\n\n${catText}\n\n` +
        `🎯 Utilisez: quiz <catégorie>\n` +
        `🎲 Aléatoire: quiz random\n` +
        `🏆 Quotidien: quiz daily`;

      return sock.sendMessage(chatId, { text }, { quoted: event });
    } catch (err) {
      return sock.sendMessage(chatId, { text: "⚠️ Impossible de récupérer les catégories." }, { quoted: event });
    }
  },

  async handleDailyChallenge({ sock, chatId, event, senderId, commandName }) {
    try {
      const res = await axios.get(`${BASE_URL}/challenge/daily?userId=${senderId}`);
      const { question, challengeDate, reward, streak } = res.data;

      const optText = question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n");
      const text = `🌟 𝗗é𝗳𝗶 𝗾𝘂𝗼𝘁𝗶𝗱𝗶𝗲𝗻\n━━━━━━━━━\n\n📅 ${challengeDate}\n🎯 Récompense bonus: +${reward} XP\n🔥 Série quotidienne: ${streak}\n\n\n❓ ${question.question}\n\n${optText}\n\n⏰ 30 secondes pour répondre !`;

      const info = await sock.sendMessage(chatId, { text }, { quoted: event });

      global.NixBot.onReply.set(info.key.id, {
        commandName,
        author: senderId,
        messageID: info.key.id,
        key: info.key, // Sauvegarder la clé pour la suppression
        answer: question.answer,
        questionId: question._id,
        startTime: Date.now(),
        isDailyChallenge: true,
        bonusReward: reward
      });

      setTimeout(() => {
        const r = global.NixBot.onReply.get(info.key.id);
        if (r) {
          sock.sendMessage(chatId, { text: `⏰ Temps écoulé ! La bonne réponse était: ${question.answer}` }, { quoted: event });
          sock.sendMessage(chatId, { delete: r.key });
          global.NixBot.onReply.delete(info.key.id);
        }
      }, 30000);
    } catch (err) {
      console.error("Erreur du défi quotidien:", err);
      return sock.sendMessage(chatId, { text: "⚠️ Impossible de créer le défi quotidien." }, { quoted: event });
    }
  },

  async handleTrueOrFalse({ sock, chatId, event, senderId, commandName }) {
    try {
      const res = await axios.get(`${BASE_URL}/question?category=torf&userId=${senderId}`);
      const { _id, question, answer } = res.data;

      const text = this.langs.en.torfReply.replace("{question}", question);
      const info = await sock.sendMessage(chatId, { text }, { quoted: event });
      const correctAnswer = answer.toUpperCase();

      global.NixBot.onReaction.set(info.key.id, {
        commandName,
        author: senderId,
        messageID: info.key.id,
        key: info.key,
        answer: correctAnswer,
        reacted: false,
        reward: 10000,
        questionId: _id,
        startTime: Date.now()
      });

      setTimeout(() => {
        const reaction = global.NixBot.onReaction.get(info.key.id);
        if (reaction && !reaction.reacted) {
          const correctText = correctAnswer === "A" ? "Vrai" : "Faux";
          sock.sendMessage(chatId, { text: this.langs.en.timeoutMessage.replace("{correctAnswer}", correctText) }, { quoted: event });
          sock.sendMessage(chatId, { delete: reaction.key });
          global.NixBot.onReaction.delete(info.key.id);
        }
      }, 30000);
    } catch (err) {
      console.error("Erreur Vrai/Faux:", err);
      return sock.sendMessage(chatId, { text: "⚠️ Impossible de créer la question Vrai/Faux." }, { quoted: event });
    }
  },

  async handleFlagQuiz({ sock, chatId, event, senderId, commandName }) {
    try {
      const res = await axios.get(`${BASE_URL}/question?category=flag&userId=${senderId}`, { timeout: 25000 });
      const { _id, question, options, answer, imageUrl } = res.data;
      
      if (!Array.isArray(options) || !options.length) {
        return sock.sendMessage(chatId, { text: "⚠️ Aucune question sur les drapeaux disponible pour le moment." }, { quoted: event });
      }

      const caption = `🏁 𝗤𝘂𝗶𝘇 𝗱𝗿𝗮𝗽𝗲𝗮𝘂𝘅\n━━━━━━━━\n\n🌍 Devinez le pays de ce drapeau :\n\n` +
              options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n") +
              `\n\n⏰ 30 secondes pour répondre.`;

      let msgPayload = { text: caption };
      if (imageUrl) {
        const stream = await this.safeStream(imageUrl);
        if (stream) msgPayload = { image: stream, caption };
      }

      const info = await sock.sendMessage(chatId, msgPayload, { quoted: event });

      global.NixBot.onReply.set(info.key.id, {
        commandName,
        author: senderId,
        messageID: info.key.id,
        key: info.key,
        answer,
        options,
        questionId: _id,
        startTime: Date.now(),
        isFlag: true,
        reward: this.envConfig?.flagReward || 10000
      });

      setTimeout(() => {
        const r = global.NixBot.onReply.get(info.key.id);
        if (r) {
          sock.sendMessage(chatId, { text: `⏰ Temps écoulé ! La bonne réponse était: ${answer}` }, { quoted: event });
          sock.sendMessage(chatId, { delete: r.key });
          global.NixBot.onReply.delete(info.key.id);
        }
      }, 30000);
    } catch (err) {
      return sock.sendMessage(chatId, { text: `⚠️ Impossible de créer le quiz drapeaux.` }, { quoted: event });
    }
  },

  async handleAnimeQuiz({ sock, chatId, event, senderId, commandName }) {
    // Implémentation similaire à handleFlagQuiz
    try {
      const res = await axios.get(`${BASE_URL}/question?category=anime&userId=${senderId}`, { timeout: 25000 });
      const { _id, question, options, answer, imageUrl, hint } = res.data;
      
      const caption = `🎌 𝗤𝘂𝗶𝘇 𝗔𝗻𝗶𝗺𝗲\n━━━━━━━━\n\n❔ 𝗜𝗻𝗱𝗶𝗰𝗲: ${hint || question}\n\n` +
              options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n") +
              `\n\n⏰ 30 secondes\n🎯 Défi de reconnaissance de personnage !`;

      let msgPayload = { text: caption };
      if (imageUrl) {
        const stream = await this.safeStream(imageUrl);
        if (stream) msgPayload = { image: stream, caption };
      }

      const info = await sock.sendMessage(chatId, msgPayload, { quoted: event });

      global.NixBot.onReply.set(info.key.id, {
        commandName,
        author: senderId,
        messageID: info.key.id,
        key: info.key,
        answer,
        options,
        questionId: _id,
        startTime: Date.now(),
        isAnime: true
      });

      setTimeout(() => {
        const r = global.NixBot.onReply.get(info.key.id);
        if (r) {
          sock.sendMessage(chatId, { text: `⏰ Temps écoulé ! La bonne réponse était: ${answer}` }, { quoted: event });
          sock.sendMessage(chatId, { delete: r.key });
          global.NixBot.onReply.delete(info.key.id);
        }
      }, 30000);
    } catch (err) {
      return sock.sendMessage(chatId, { text: `⚠️ Impossible de créer le quiz anime.` }, { quoted: event });
    }
  },

  async handleImageQuiz({ sock, chatId, event, senderId, commandName, category, title }) {
    try {
      const res = await axios.get(`${BASE_URL}/question?category=${category}&userId=${senderId}`, { timeout: 25000 });
      const { _id, question, options, answer, imageUrl, hint } = res.data;
      
      const caption = `${title}\n━━━━━━━━\n\n❔ ${hint || question}\n\n` +
        options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join("\n") +
        `\n\n⏰ 30 secondes pour répondre (A/B/C/D)`;

      let msgPayload = { text: caption };
      if (imageUrl) {
        const stream = await this.safeStream(imageUrl);
        if (stream) msgPayload = { image: stream, caption };
      }
      const info = await sock.sendMessage(chatId, msgPayload, { quoted: event });

      global.NixBot.onReply.set(info.key.id, {
        commandName,
        author: senderId,
        messageID: info.key.id,
        key: info.key,
        answer,
        options,
        questionId: _id,
        startTime: Date.now(),
        isImage: true,
        category
      });

      setTimeout(() => {
        const r = global.NixBot.onReply.get(info.key.id);
        if (r) {
          sock.sendMessage(chatId, { text: `⏰ Temps écoulé ! La bonne réponse était : ${answer}` }, { quoted: event });
          sock.sendMessage(chatId, { delete: r.key });
          global.NixBot.onReply.delete(info.key.id);
        }
      }, 30000);
    } catch (err) {
      return sock.sendMessage(chatId, { text: `⚠️ Impossible de créer le quiz ${category}.` }, { quoted: event });
    }
  },

  async handleQuiz({ sock, chatId, event, args, senderId, commandName, getLang, forcedDifficulty = null }) {
    try {
      const userName = await this.getUserName(event);

      await axios.post(`${BASE_URL}/user/update`, { userId: senderId, name: userName });

      const category = args[0]?.toLowerCase() || "";
      let queryParams = { userId: senderId };
      if (category && category !== "random") queryParams.category = category;
      if (forcedDifficulty) queryParams.difficulty = forcedDifficulty;

      const res = await axios.get(`${BASE_URL}/question`, { params: queryParams });
      const { _id, question, options, answer, category: qCategory, difficulty, imageUrl, hint } = res.data;

      const optText = options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n");

      // Si le système de langage n'est pas dispo, on fallback sur une chaîne locale
      const template = getLang ? getLang("reply") : this.langs.en.reply;
      const caption = template
        .replace("{category}", qCategory?.charAt(0).toUpperCase() + qCategory?.slice(1) || "Aléatoire")
        .replace("{difficulty}", difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1) || "Moyen")
        .replace("{question}", hint || question)
        .replace("{options}", optText);

      let msgPayload = { text: caption };
      if (imageUrl) {
        const stream = await this.safeStream(imageUrl);
        if (stream) msgPayload = { image: stream, caption };
      }
      const info = await sock.sendMessage(chatId, msgPayload, { quoted: event });

      global.NixBot.onReply.set(info.key.id, {
        commandName,
        author: senderId,
        messageID: info.key.id,
        key: info.key,
        answer,
        options,
        questionId: _id,
        startTime: Date.now(),
        difficulty,
        category: qCategory,
        isImage: !!imageUrl
      });

      setTimeout(() => {
        const r = global.NixBot.onReply.get(info.key.id);
        if (r) {
          const timeoutText = getLang ? getLang("timeoutMessage").replace("{correctAnswer}", answer) : `⏰ 𝖳𝖾𝗆𝗉𝗌 é𝖼𝗈𝗎𝗅é ! 𝖡𝗈𝗇𝗇𝖾 𝗋é𝗉𝗈𝗇𝗌𝖾: ${answer}`;
          sock.sendMessage(chatId, { text: timeoutText }, { quoted: event });
          sock.sendMessage(chatId, { delete: r.key });
          global.NixBot.onReply.delete(info.key.id);
        }
      }, 30000);
    } catch (err) {
      return sock.sendMessage(chatId, { text: "⚠️ Impossible de récupérer une question." }, { quoted: event });
    }
  },

  async handleCategoryLeaderboard({ sock, chatId, args, event }) {
    try {
      const category = args[0]?.toLowerCase();
      if (!category) return sock.sendMessage(chatId, { text: "📚 Veuillez spécifier une catégorie." }, { quoted: event });

      const page = parseInt(args[1]) || 1;
      const res = await axios.get(`${BASE_URL}/leaderboard/category/${category}?page=${page}&limit=10`);
      const { users, pagination } = res.data;

      if (!users || users.length === 0) {
        return sock.sendMessage(chatId, { text: `🏆 Aucun joueur trouvé pour la catégorie: ${category}.` }, { quoted: event });
      }

      const topPlayersWithNames = await Promise.all(users.map(async (u, i) => {
        let userName = u.name || 'Joueur Anonyme';
        const position = (pagination.currentPage - 1) * 10 + i + 1;
        const crown = position === 1 ? "👑" : position === 2 ? "🥈" : position === 3 ? "🥉" : "🏅";
        const title = this.getUserTitle(u.correct || 0);
        return `${crown} #${position} ${userName}\n🎖️ ${title}\n📊 ${u.correct || 0}/${u.total || 0} (${u.accuracy || 0}%)`;
      }));

      const text = `🏆 𝗖𝗹𝗮𝘀𝘀𝗲𝗺𝗲𝗻𝘁: ${category.charAt(0).toUpperCase() + category.slice(1)}\n━━━━━━━━━\n\n${topPlayersWithNames.join('\n\n')}\n\n` +
        `📖 Page ${pagination.currentPage}/${pagination.totalPages}\n` +
        `👥 Total joueurs: ${pagination.totalUsers}`;

      return sock.sendMessage(chatId, { text }, { quoted: event });
    } catch (err) {
      return sock.sendMessage(chatId, { text: "⚠️ Impossible de récupérer le classement." }, { quoted: event });
    }
  },

  onReaction: async function ({ sock, chatId, event, Reaction, senderId, usersData }) {
    try {
      const { author, messageID, answer, reacted, reward, key } = Reaction;
      const reactionEmoji = event.message.reactionMessage.text;

      if (senderId !== author || reacted) return;

      const userAnswer = reactionEmoji === '😆' ? "A" : "B"; 
      const isCorrect = userAnswer === answer;
      const timeSpent = (Date.now() - Reaction.startTime) / 1000;

      if (timeSpent > 30) {
        return sock.sendMessage(chatId, { text: "⏰ Temps écoulé !" }, { quoted: event });
      }

      const userName = await this.getUserName(event);
      const answerData = { userId: senderId, questionId: Reaction.questionId, answer: userAnswer, timeSpent, userName };

      try {
        const res = await axios.post(`${BASE_URL}/answer`, answerData);
        const { user, xpGained } = res.data;

        if (isCorrect) {
          if (usersData) {
            const userData = await usersData.get(senderId) || {};
            userData.money = (userData.money || 0) + 10000 + ((user.currentStreak || 0) * 1000);
            await usersData.set(senderId, userData);
          }

          const successMsg = `🎯 𝗕𝗥𝗔𝗩𝗢 ! \n━━━━━━━━━\n🎉 𝗙é𝗹𝗶𝗰𝗶𝘁𝗮𝘁𝗶𝗼𝗻𝘀, ${userName} ! 🎉\n✨ 𝗫𝗣 𝗴𝗮𝗴𝗻é: +${xpGained || 15} ⚡\n🔥 𝗦é𝗿𝗶𝗲: ${user.currentStreak || 0} 🚀\n⏱️ 𝗧𝗲𝗺𝗽𝘀: ${timeSpent.toFixed(1)}s`;
          sock.sendMessage(chatId, { text: successMsg }, { quoted: event });
        } else {
          const correctText = answer === "A" ? "Vrai" : "Faux";
          sock.sendMessage(chatId, { text: `❌ 𝗥𝗮𝘁é !\n━━━━━━━━━\n🎯 𝗕𝗼𝗻𝗻𝗲 𝗿é𝗽𝗼𝗻𝘀𝗲: ${correctText} ✅\n👤 ${userName}\n💔 𝗦é𝗿𝗶𝗲 𝗿é𝗶𝗻𝗶𝘁𝗶𝗮𝗹𝗶𝘀é𝗲` }, { quoted: event });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du score:", error);
      }

      global.NixBot.onReaction.get(messageID).reacted = true;
      setTimeout(() => global.NixBot.onReaction.delete(messageID), 1000);
    } catch (err) {
      console.error("Erreur de réaction au quiz:", err);
    }
  },

  onReply: async function ({ sock, chatId, event, Reply, senderId, usersData }) {
    if (Reply.author !== senderId) return;

    try {
      const messageContent = event.message?.conversation || event.message?.extendedTextMessage?.text || "";
      const ans = messageContent.trim().toUpperCase();

      if (!["A", "B", "C", "D"].includes(ans)) {
        return sock.sendMessage(chatId, { text: "❌ Veuillez répondre avec A, B, C ou D uniquement !" }, { quoted: event });
      }

      const timeSpent = (Date.now() - Reply.startTime) / 1000;
      if (timeSpent > 30) return sock.sendMessage(chatId, { text: "⏰ Temps écoulé !" }, { quoted: event });

      const userName = await this.getUserName(event);
      let correctAnswer = Reply.answer;
      let userAnswer = ans;

      if ((Reply.isFlag || Reply.isAnime || Reply.isImage) && Reply.options) {
        const optionIndex = ans.charCodeAt(0) - 65;
        if (optionIndex >= 0 && optionIndex < Reply.options.length) {
          userAnswer = Reply.options[optionIndex];
        }
      }

      const answerData = { userId: senderId, questionId: Reply.questionId, answer: userAnswer, timeSpent, userName };
      const res = await axios.post(`${BASE_URL}/answer`, answerData);
      
      const { result, user } = res.data;
      let responseMsg;

      if (result === "correct") {
        if (usersData) {
          const userData = await usersData.get(senderId) || {};
          let baseMoneyReward = 10000;
          userData.money = (userData.money || 0) + baseMoneyReward + ((user.currentStreak || 0) * 1000);
          await usersData.set(senderId, userData);
        }
        
        responseMsg = `🎉 Bonne réponse ! 💰\n` +
          `✨ XP: +${user.xpGained || 15}\n` +
          `📊 Score: ${user.correct || 0}/${user.total || 0} (${user.accuracy || 0}%)\n` +
          `🔥 Série: ${user.currentStreak || 0}\n` +
          `⚡ Temps de réponse: ${timeSpent.toFixed(1)}s\n` +
          `👤 ${userName}`;
      } else {
        responseMsg = `❌ Mauvaise réponse ! Bonne réponse: ${correctAnswer}\n` +
          `📊 Score: ${user.correct || 0}/${user.total || 0} (${user.accuracy || 0}%)\n` +
          `💔 Série réinitialisée\n` +
          `👤 ${userName}`;
      }

      await sock.sendMessage(chatId, { text: responseMsg }, { quoted: event });

      if (user.achievements && user.achievements.length > 0) {
        const achievementMsg = user.achievements.map(ach => `🏆 ${ach}`).join('\n');
        await sock.sendMessage(chatId, { text: `🏆 Succès débloqué !\n${achievementMsg}\n💰 +50,000 pièces bonus !\n✨ +100 XP bonus !` }, { quoted: event });
      }

      // Suppression du message du bot contenant la question via la clé sauvegardée
      if (Reply.key) {
         await sock.sendMessage(chatId, { delete: Reply.key });
      }
      global.NixBot.onReply.delete(Reply.messageID);
    } catch (err) {
      console.error("Erreur de réponse:", err);
      sock.sendMessage(chatId, { text: `⚠️ Erreur lors du traitement de votre réponse.` }, { quoted: event });
    }
  },

  envConfig: {
    reward: 10000,
    achievementReward: 50000,
    streakReward: 1000,
    flagReward: 12000,
    animeReward: 15000,
    imageReward: 12000,
    dailyChallengeBonus: 20000,
    hardDifficultyReward: 15000,
    easyDifficultyReward: 7500
  }
};