const Discord = require('discord.js');
const playQueue = require("../functions/playqueue.js")
const leave = require("./leave.js")

module.exports = {
	name: 'skip',
	description: 'Skip a song in the queue',
	aliases: ['sk'],
	args: true,
	argsNeeded: false,
	async execute(message, args, client, queue, searchresult) {
        if (queue.length > 0) {
            queue.shift();
            if (queue.length > 0) {
                playQueue.execute(message, client, queue)
            }
            else {
                sendEmbed(message, "", "Queue empty", "")
                leave.execute(message, queue)
            }
            
        }
        else {
            sendEmbed(message, "", "Queue empty", "")
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