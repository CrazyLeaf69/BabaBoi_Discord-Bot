const Discord = require('discord.js');
const fetch = require("node-fetch");
const playQueue = require("../playqueue.js")

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
    message.channel.send(embed)
}