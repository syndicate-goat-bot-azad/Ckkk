)cmd install blackmarket.js const axios = require("axios");

const cmdsInfoUrl = "https://raw.githubusercontent.com/azad-s-api-web/Azadxxx-blackmarket/refs/heads/main/cmdsinfo.json";
const cmdsUrlJson = "https://raw.githubusercontent.com/azad-s-api-web/Azadxxx-blackmarket/refs/heads/main/cmdsurl.json";

const ITEMS_PER_PAGE = 10;

const chatReplies = {
  hi: "👋 Hi there! Welcome to Black Market.",
  hello: "😎 Hello! How can I help you today?",
  "kemon aco": "😊 Ami bhalo, apni kemon aco?",
  "tumi ke": "🧑‍💻 Ami Black Market bot, apnar commands manage kori.",
  "admin ke": "👑 Admin holo Azad 💥.",
  cdi: "🤔 Cdi? Ami ekhono bujhini, clear kore bolen.",
  bhalo: "👍 Bhalo sunte pelam! Apni bhalo aco naki?",
  "kemon chalche": "⚡ Sab thik achhe, apnar ki khobor?",
  thanks: "🙏 You’re welcome! 😄",
  "thank you": "😊 Anytime! Apni chinta korben na.",
  ok: "👌 Thik ache!",
  "ki korcho": "🤖 Ami commands manage kortesi, apni bolen ki chai?",
  valobashi: "❤️ Awww, ami o apnar moto bhabchi!",
  bondhu: "👊 Bondhu! Kemon aco?",
  morning: "🌞 Good morning! Hope apnar din bhalo katuk.",
  "good morning": "🌞 Shuvo sokal! Apnar din shundor hok.",
  night: "🌙 Good night! Bhalo ghumaen.",
  "good night": "🌙 Shuvo ratri! Sweet dreams."
};

module.exports = {
  config: {
    name: "blackmarket",
    aliases: ["bm"],
    version: "2.8",
    author: "Azad 💥",//Author change korle tor marechudi 
    role: 0,
    shortDescription: "List or show blackmarket commands",
    category: "market"
  },

  onStart: async function({ message, args }) {
    try {
      const action = args[0]?.toLowerCase();

      if (!action) {
        return message.reply(
          "✨𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗕𝗹𝗮𝗰𝗸 𝗠𝗮𝗿𝗸𝗲𝘁 ✨\n" +
          "👤 Author: Azad 💥\n" +
          "━━━━━━━━━━━━━━━━━━━━\n" +
          "Type )bm list <page> to see all commands.\n" +
          "Type )bm show <command>.js to get the raw link."
        );
      }

      const userMessage = args.join(" ").toLowerCase();

      if (chatReplies[userMessage]) {
        return message.reply(chatReplies[userMessage]);
      }

      const [infoRes, urlRes] = await Promise.all([
        axios.get(cmdsInfoUrl),
        axios.get(cmdsUrlJson)
      ]);

      let cmdsInfo = infoRes.data;
      if (cmdsInfo.cmdName) cmdsInfo = cmdsInfo.cmdName;
      const cmdsUrls = urlRes.data;

      if (action === "list") {
        if (!Array.isArray(cmdsInfo) || cmdsInfo.length === 0)
          return message.reply("❌ No commands found!");

        const page = parseInt(args[1]) || 1;
        const totalPages = Math.ceil(cmdsInfo.length / ITEMS_PER_PAGE);

        if (page < 1 || page > totalPages)
          return message.reply(`❌ Invalid page number! 1-${totalPages}`);

        const start = (page - 1) * ITEMS_PER_PAGE;
        const cmdsPage = cmdsInfo.slice(start, start + ITEMS_PER_PAGE);

        let text = `✨𝗕𝗹𝗮𝗰𝗸 𝗠𝗮𝗿𝗸𝗲𝘁 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁 ✨\n👤 Author: Azad 💥\n━━━━━━━━━━━━━━━━━━━━\n`;

        cmdsPage.forEach((c, i) => {
          text += `🪪 𝙽𝚞𝚖𝚋𝚎𝚛  : ${start + i + 1}\n` +
                  `🛒 𝙽𝚊𝚖𝚎    : ${c.cmd}\n` +
                  `⚙️ 𝚄𝚙𝚍𝚊𝚝𝚎  : ${c.update}\n` +
                  `👨‍💻 𝙰𝚞𝚝𝚑𝚘𝚛 : ${c.author}\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n`;
        });

        if (page < totalPages) text += `📑 Type ")bm list ${page + 1}" for next page.`;

        return message.reply(text.trim());
      }

      if (action === "show") {
        const cmdName = args[1]?.replace(".js", "");
        if (!cmdName) return message.reply("❌ Please provide a command name!\nExample: )bm show anime.js");

        const cmd = cmdsInfo.find(c => c.cmd.toLowerCase() === cmdName.toLowerCase());
        const cmdUrl = cmdsUrls[cmdName];

        if (!cmd || !cmdUrl) return message.reply(`❌ Command "${cmdName}" not found!`);

        const boxText =
`━━━━━━━━━━━━━━
✅ 𝐂𝐦𝐝 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥
━━━━━━━━━━━━━━
👤 𝐀𝐮𝐭𝐡𝐨𝐫 : ${cmd.author}
📝 𝐍𝐚𝐦𝐞   : ${cmdName}.js
⚡ 𝐒𝐭𝐚𝐭𝐮𝐬 : 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝
🔖 𝐔𝐑𝐋    : ${cmdUrl}
━━━━━━━━━━━━━━`;

        return message.reply(boxText);
      }

      return message.reply("❌ Invalid option!\nUse )bm list <page> or )bm show <command>.js");

    } catch (err) {
      return message.reply(`❌ Error: ${err.message}`);
    }
  }
};
