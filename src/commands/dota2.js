const fs = require("fs");
const path = require("path");

const execute = (bot, msg, args) => {
    let fileNames = [];

    const Arquivos = fs.readdirSync(path.join(__dirname, "/sonsDota2")).
        filter(fileName => fileName.endsWith(".mp3"));
    for (var fileName of Arquivos) {
        let name = fileName.replace(".mp3", '');
        fileNames.push(name);
    }
    if (args == "") {
        msg.channel.send(fileNames);

    } else {
        let argsOk = null;
        for (nn of fileNames) {
            if (nn == args) {
                argsOk = args;
            }
        }
        if (argsOk != null) {
            song = fs.createReadStream("./src/commands/sonsDota2/" + args + ".mp3");
            playSong(bot, msg, song);
        } else {
            return msg.reply("Som não encontrado");
        }
    }
};


const playSong = async (bot, msg, song) => {
    let queue = bot.queues.get(msg.member.guild.id);
    if (!song) {
        if (queue) {
            queue.connection.disconnect();
            return bot.queues.delete(msg.member.guild.id);
        }
    }
    if (!msg.member.voice.channel) {
        return msg.reply(
            "você precisa estar em um canal de voz para reproduzir uma som!"
        );
    }
    if (!queue) {
        const conn = await msg.member.voice.channel.join();
        queue = {
            volume: 10,
            connection:conn,
            dispatcher: null,
            songs: [song],
        };
    }
    queue.dispatcher = await queue.connection.play(song);
    queue.dispatcher.on("finish", () => {
        queue.songs.shift();
        playSong(bot, msg, queue.songs[0]);
    });
    bot.queues.set(msg.member.guild.id, queue);
};



module.exports = {
    name: "dota2",
    help: "Sons dota 2, para exibir todos os Sons, envie +dota2 ",
    execute,
    playSong,
};