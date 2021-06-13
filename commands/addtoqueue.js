const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const fetch = require("node-fetch");

module.exports = {
	name: 'addtoqueue',
	description: 'Search for a song and add it to the queue',
	aliases: 'atq',
	args: true,
	argsNeeded: true,
	async execute(message, args, client, queue, searchresult) {
        await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${args}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
        .then(res => res.json()).then(async data=> {
            const items = data.items;
            const title = items[0].snippet.title
            const videoId = items[0].id.videoId;
            const url = `https://www.youtube.com/watch?v=${videoId}`;
            console.log(title);
            console.log(url);
            queue.push({title: title, url: url});
        });
        let queueTitles = "";
        for (let i = 0; i < queue.length; i++) {
            const song = queue[i];
            queueTitles += `${i+1}: ${song.title}\n`;
        }
        console.log(queue);
        sendEmbed(message, "Current queue:", queueTitles, "");
        if (queue.length == 1) {
            playQueue(message, client, queue)
        }

        // await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${args}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
        // .then(res => res.json()).then(async data=> {
        //     const items = data.items;
        //     const title = items[0].snippet.title
        //     const videoId = items[0].id.videoId;
        //     const url = `https://www.youtube.com/watch?v=${videoId}`;
        //     console.log(title);
        //     console.log(url);
        //     queue[0] = {title: items[0].snippet.title, url: url};
        //     console.log(queue);
        //     playQueue(message, client, queue)
        // });
    },
};
async function playQueue(message, client, queue) {
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
                `Requested by @${message.member.nick || message.member.user.username}`)
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
                playQueue(message, client, queue);
            }
            else {
                sendEmbed(message, "", `Queue empty\nLeft voicechannel: **${voiceChannel.name}**`, "")
            }
        });

    } else {
        message.reply('You need to join a voice channel first!');
    }
};

function sendEmbed(message, title, description, footer) {
    embed = new Discord.MessageEmbed()
        .setColor("#0036FF")
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer)
    message.channel.send(embed)
}