const Discord = require('discord.js');
const fs = require('fs');
const playQueue = require("../playqueue.js")

module.exports = {
	name: 'addfromsearch',
	description: 'Add a song from the previous search to the queue',
	aliases: ['afs'],
	args: true,
	argsNeeded: true,
	async execute(message, args, client, queue, searchResults) {
        args-=1
        var rawdata = fs.readFileSync('./searchresults.json')
        var array = JSON.parse(rawdata);
        let title;
        let url;
        if (searchResults[args] == undefined) {
            title = array[args].title
            url = array[args].url
        } else {
            title = searchResults[args].title
            url = searchResults[args].url
        }
        queue.push({title: title, url: url});
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
