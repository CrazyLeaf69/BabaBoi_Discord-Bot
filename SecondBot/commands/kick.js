module.exports = {
	name: 'kick',
	description: 'If you want to kick a member',
	guildOnly: true,
	args: true,
	usage: '<user>',
	cooldown: 10,
	execute(message, args) {
		if (!message.mentions.users.size) {
            return message.reply('you need to tag a user in order to kick them!');
        }
        const taggedUser = message.mentions.users.first();
        message.channel.send(`You wanted to kick: ${taggedUser.username}`);
	},
};