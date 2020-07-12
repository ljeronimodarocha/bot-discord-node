const Discord = require("discord.js");
const doten = require("dotenv");
const fs = require("fs");
const path = require("path");

doten.config();

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.queues = new Map();

const commandFiles = fs.
    readdirSync(path.join(__dirname, "/commands")).
    filter(fileName => fileName.endsWith(".js"));

for (var fileName of commandFiles) {
    const command = require(`./commands/${fileName}`)
    bot.commands.set(command.name, command);

}

bot.login(process.env.TOKEN);
bot.on("ready", () => {
    console.log(`Estou conectado  ${bot.user.username}`);
});


bot.on("message", (msg) => {
    if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot) return;
    const args = msg.content.slice(process.env.PREFIX.length).split(" ");
    const command = args.shift();
    try {
        bot.commands.get(command).execute(bot, msg, args);
    } catch (e) {
        console.error(e);
        return msg.reply("Comando não encontrado!")
    }
})
