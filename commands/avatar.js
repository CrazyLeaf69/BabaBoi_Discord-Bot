const Discord = require("discord.js");

module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp'],
    description: 'Show users Avatar',
    usage: '<user>',
    cooldown: 5,
    args: true,
    argsNeeded: true,
	execute(message) {
        message.mentions.users.map(user => {
            if (user.username == message.author.username) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Your avatar:")
                    .setColor("#0036FF")
                    .setImage(message.author.displayAvatarURL({ format: "png", dynamic: true }));
                message.channel.send({ embeds: [embed] });
            }
            else {
                message.mentions.users.map(user => {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(user.username + "'s avatar:")
                        .setColor("#0036FF")
                        .setImage(user.displayAvatarURL({ format: "png", dynamic: true }));
                    message.channel.send({ embeds: [embed] });
                });
            }
        });

	},
};