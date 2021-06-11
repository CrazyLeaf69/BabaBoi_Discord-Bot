const Discord = require('discord.js');
module.exports = {
	name: 'val',
	aliases: ['v'],
	description: 'Show rank of player',
	args: true,
	argsNeeded: true,
	execute(message, args) {
		const acc = args[0].split("#")
		const fetch = require("node-fetch");
		const cheerio = require("cheerio");
		try {
			fetch("https://tracker.gg/valorant/profile/riot/" + acc[0] +"%23" + acc[1] + "/overview").then(res => res.text())
			.then(html => {
				const $ = cheerio.load(html)
				const title = $(".valorant-highlighted-stat__value")
				const og = title.text()
				rank = og.substring(0,og.split("").length-4)

				const embed = new Discord.MessageEmbed()
				.setTitle("Show players ranks")
				.setDescription(acc[0] + "'s rank is " + "**" + rank + "**")
				.setColor("#0036FF")
				message.channel.send(embed)
			});	
		} catch (error) {
			console.error();
		}

	}
};