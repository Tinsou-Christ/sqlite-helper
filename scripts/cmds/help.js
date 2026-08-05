const axios = require('axios');

function toCmdFont(text = "") {
  const map = {
    A:"𝖠",B:"𝖡",C:"𝖢",D:"𝖣",E:"𝖤",F:"𝖥",G:"𝖦",H:"𝖧",I:"𝖨",J:"𝖩",
    K:"𝖪",L:"𝖫",M:"𝖬",N:"𝖭",O:"𝖮",P:"𝖯",Q:"𝖰",R:"𝖱",S:"𝖲",T:"𝖳",
    U:"𝖴",V:"𝖵",W:"𝖶",X:"𝖷",Y:"𝖸",Z:"𝖹",
    a:"𝖺",b:"𝖻",c:"𝖼",d:"𝖽",e:"𝖾",f:"𝖿",g:"𝗀",h:"𝗁",i:"𝗂",j:"𝗃",
    k:"𝗄",l:"𝗅",m:"𝗆",n:"𝗇",o:"𝗈",p:"𝗉",q:"𝗊",r:"𝗋",s:"𝗌",t:"𝗍",
    u:"𝗎",v:"𝗏",w:"𝗐",x:"𝗑",y:"𝗒",z:"𝗓", " ":" "
  };
  return text.split("").map(c => map[c] || c).join("");
}

function toQuestionFont(text = "") {
  const map = {
    A:"𝐴",B:"𝐵",C:"𝐶",D:"𝐷",E:"𝐸",F:"𝐹",G:"𝐺",H:"𝐻",I:"𝐼",J:"𝐽",
    K:"𝐾",L:"𝐿",M:"𝑀",N:"𝑁",O:"𝑂",P:"𝑃",Q:"𝑄",R:"𝑅",S:"𝑆",T:"𝑇",
    U:"𝑈",V:"𝑉",W:"𝑊",X:"𝑋",Y:"𝑌",Z:"𝑍",
    a:"𝑎",b:"𝑏",c:"",d:"𝑑",e:"𝑒",f:"𝑓",g:"𝑔",h:"ℎ",i:"𝑖",j:"𝑗",
    k:"𝑘",l:"𝑙",m:"𝑚",n:"𝑛",o:"𝑜",p:"𝑝",q:"𝑞",r:"𝑟",s:"𝑠",t:"𝑡",
    u:"𝑢",v:"𝑣",w:"𝑤",x:"𝑥",y:"𝑦",z:"𝑧", " ":" "
  };
  return text.split("").map(c => map[c] || c).join("");
}

module.exports = {
  config: {
    name: "help",
    version: "6.3",
    author: "Christus",
    countDown: 2,
    role: 0,
    category: "info",
    prefix: true,
    description: { en: "Explore all bot commands" },
    guide: { en: "{pn} <command> | {pn} -ai <cmd> <question>" }
  },

  onStart: async function ({ sock, chatId, event, senderId, args, cmds, prefix }) {
    try {
      let ppUrl;
      try {
        ppUrl = await sock.profilePictureUrl(senderId, 'image');
      } catch {
        ppUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      }

      if (args[0]?.toLowerCase() === "-ai") {
        const cmdName = args[1]?.toLowerCase();
        const questionRaw = args.slice(2).join(" ");

        if (!cmdName) {
          return sock.sendMessage(chatId, { 
            image: { url: ppUrl }, 
            caption: `❌ Usage: ${prefix}help -ai <command> <question>` 
          }, { quoted: event });
        }

        let command = cmds.get(cmdName);
        if (!command) {
          for (const [, c] of cmds) {
            if (c.config.aliases?.includes(cmdName)) {
              command = c;
              break;
            }
          }
        }

        if (!command) {
          return sock.sendMessage(chatId, { 
            image: { url: ppUrl }, 
            caption: `❌ Command "${cmdName}" not found.` 
          }, { quoted: event });
        }

        const info = `
Command Name: ${command.config.name}
Description: ${command.config.description?.en || "No description"}
Category: ${command.config.category || "Misc"}
Aliases: ${command.config.aliases?.join(", ") || "None"}
Role: ${command.config.role}
Cooldown: ${command.config.countDown}s
`;

        const prompt = `You are an assistant. Info:\n${info}\nUser question: ${questionRaw || "Explain this command."}\nAnswer clearly without * characters.`;

        try {
          const { data } = await axios.get(`https://christus-api.vercel.app/ai/gemini-proxy2?prompt=${encodeURIComponent(prompt)}`);
          let aiReply = (data?.result || "No AI response.").replace(/\*/g, "");
          const styledQuestion = toQuestionFont(questionRaw || "Explain how to use this command.");

          return sock.sendMessage(chatId, {
            image: { url: ppUrl },
            caption: `🤖 AI Assistant — ${command.config.name}\n\n❓ ${styledQuestion}\n\n${aiReply}`
          }, { quoted: event });
        } catch (err) {
          return sock.sendMessage(chatId, { text: "❌ AI request failed." }, { quoted: event });
        }
      }

      if (!args.length) {
        const categories = {};
        const uniqueCommands = new Set();

        for (const [name, cmd] of cmds) {
          if (uniqueCommands.has(cmd.config.name)) continue;
          uniqueCommands.add(cmd.config.name);
          const cat = cmd.config.category || "Misc";
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(cmd.config.name);
        }

        let body = "📚 NIX BOT COMMANDS\n\n";
        Object.keys(categories).sort().forEach(cat => {
          const list = categories[cat].sort().map(c => `• ${toCmdFont(c)}`).join("  ");
          body += `🍓 ${cat.toUpperCase()}\n${list}\n\n`;
        });

        body += `📊 Total: ${uniqueCommands.size}\n`;
        body += `🔧 Info: ${prefix}help <cmd>\n`;
        body += `🤖 AI: ${prefix}help -ai <cmd> <question>`;

        return sock.sendMessage(chatId, { 
          image: { url: ppUrl }, 
          caption: body 
        }, { quoted: event });
      }

      const query = args[0].toLowerCase();
      let cmd = cmds.get(query);
      if (!cmd) {
        for (const [, c] of cmds) {
          if (c.config.aliases?.includes(query)) {
            cmd = c;
            break;
          }
        }
      }

      if (!cmd) {
        return sock.sendMessage(chatId, { text: `❌ Command "${query}" not found.` }, { quoted: event });
      }

      const roleMap = { 0: "Everyone", 1: "Group Admin", 2: "Bot Admin", 3: "Owner" };
      const cfg = cmd.config;
      const guideText = cfg.guide?.en || cfg.guide || "No guide available";
      const usage = guideText.replace(/\{pn\}/g, `${prefix}${cfg.name}`).replace(/\{p\}/g, prefix);

      const detail = [
        `✨ ${toCmdFont(cfg.name.toUpperCase())} ✨`,
        `📝 Description: ${cfg.description?.en || cfg.description || "None"}`,
        `📂 Category: ${cfg.category || "Misc"}`,
        `🔤 Aliases: ${cfg.aliases?.length ? cfg.aliases.join(", ") : "None"}`,
        `🛡️ Role: ${roleMap[cfg.role] || cfg.role} | ⏱️ Cooldown: ${cfg.countDown || 0}s`,
        `🚀 Version: ${cfg.version} | 👨‍💻 Author: ${cfg.author}`,
        `💡 Usage: ${usage}`
      ].join("\n");

      return sock.sendMessage(chatId, { 
        image: { url: ppUrl }, 
        caption: detail 
      }, { quoted: event });

    } catch (e) {
      console.error(e);
      sock.sendMessage(chatId, { text: "⚠️ Error in help command." }, { quoted: event });
    }
  }
};
