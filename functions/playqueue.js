const Discord = require('discord.js');
const ytdl = require("ytdl-core");

module.exports = {
    async execute(message, client, queue) {
        const voiceChannel = message.member.voice.channel;
        if (voiceChannel) {
            var botInChannel = false
            voiceChannel.members.forEach(async element => {
                if (element.user.username == client.user.username) {
                    botInChannel = true;
                }
            });
            let connection = await voiceChannel.join();
            const dispatcher = connection.play(ytdl(queue[0].url,
                { filter: 'audioonly' }));
        
            if (botInChannel == false) {
                sendEmbed(message, 
                    `Music Playback`,
                    `Joining channel **${voiceChannel.name}**...\n
                    Now playing: [${queue[0].title}](${queue[0].url})`,
                    `Requested by @${message.member.nickname || message.member.user.username}`)
            }
            else {
                sendEmbed(message, 
                    `Music Playback`,
                    `Now playing: [${queue[0].title}](${queue[0].url})`,
                    `Requested by @${message.member.nickname || message.member.user.username}`)
            }
            //dispatcher.setVolume(0.3);
    
            dispatcher.on("finish", () => {
                voiceChannel.leave();
                queue.shift();
                if (queue.length > 0) {
                    this.execute(message, client, queue);
                }
                else {
                    sendEmbed(message, "", `Queue empty\nLeft voicechannel: **${voiceChannel.name}**`, "")
                }
            });
    
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
}

function sendEmbed(message, title, description, footer) {
    embed = new Discord.MessageEmbed()
        .setColor("#0036FF")
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer)
    message.channel.send(embed)
}