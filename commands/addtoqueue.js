const Discord = require('discord.js');
const fetch = require("node-fetch");
const playQueue = require("../functions/playqueue.js")
const decode = require("../functions/decode_string.js")
const FancyTimeFormat = require("../functions/FancyTimeFormat.js");

module.exports = {
	name: 'addtoqueue',
	description: 'Search for a song and add it to the queue',
	aliases: ['atq'],
	args: true,
	argsNeeded: true,
	async execute(message, args, client, queue, searchresult) {
        await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${args}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
        .then(res => res.json()).then(async data=> {
            const items = data.items;
            const title = await decode.execute(items[0].snippet.title)
            const videoId = items[0].id.videoId;
            const url = `https://www.youtube.com/watch?v=${videoId}`;
            let duration;
            await fetch(`https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
            .then(res => res.json()).then(async data=> {
                const time = (data.items[0].contentDetails.duration);
                let formattedTime;
                if (time.includes("H")) {
                    formattedTime = time.replace("PT","").replace("H",":").replace("M",":").replace("S","")
                }
                else if (!time.includes("H")) {
                    formattedTime = time.replace("PT","").replace("M",":").replace("S","")
                }
                else if (!time.includes("M")) {
                    formattedTime = time.replace("PT","").replace("S","")
                }
                const fT = formattedTime.split(":")
                const H = parseInt(fT[fT.length-3]); 
                const M = parseInt(fT[fT.length-2]); 
                const S = parseInt(fT[fT.length-1]);
                const TimeInSeconds = (H ? H*3600 : 0)+(M ? M*60 : 0)+S
                duration = FancyTimeFormat.execute(TimeInSeconds);
            });
            console.log(title);
            console.log(url);
            queue.push({title: title, url: url, duration: duration});
        });
        let queueTitles = "";
        for (let i = 0; i < queue.length; i++) {
            const song = queue[i];
            queueTitles += `${i+1}: ${song.title}\n`;
        }
        console.log(queue);
        sendEmbed(message, "Current queue:", queueTitles, "");
        if (queue.length == 1) {
            playQueue.execute(message, client, queue)
        }
    },
};

function sendEmbed(message, title, description, footer) {
    embed = new Discord.MessageEmbed()
        .setColor("#0036FF")
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer)
    message.channel.send({ embeds: [embed] })
}