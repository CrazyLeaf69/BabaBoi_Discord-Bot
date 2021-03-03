const Discord = require('discord.js');

module.exports = {
	name: 'attend',
	description: 'How many people will attend an event',
	aliases: ['att'],
	usage: '<your event or question>',
	args: true,
	argsNeeded: true,

	async execute(message, args, client) {
		let attendanceList = "**Kommer:**\n";
		let i = 1;
		embed = new Discord.MessageEmbed()
			.setTitle(message.content.split(" ").splice(1).join(" "))
			.setDescription(attendanceList)
			.setColor("#0036FF")
		msg = await message.channel.send(embed);
		msg.react('👍').then(() => msg.react('👎'));

		msg.awaitReactions(reaction => {
			const array = reaction.users.cache.array();
			const user = array[array.length - 1].username
			if (reaction.emoji.name === '👍' && user != client.user.username) {
				attendanceList += `${user}\n`
				
				embed = new Discord.MessageEmbed()
					.setTitle(message.content.split(" ").splice(1).join(" "))
					.setDescription(attendanceList)
					.setFooter(`Totalt antal uppskrivna: ${i}`)
					.setColor("#0036FF")
				msg.edit(embed);
				i++;
			}
		});
	},
};
