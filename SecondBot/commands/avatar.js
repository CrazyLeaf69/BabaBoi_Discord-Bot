module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp'],
    description: 'Show users Avatar',
    usage: '<user>',
    cooldown: 5,
    args: true,
	execute(message) {
		if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
        }

        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
        });
    
        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
        message.channel.send(avatarList);
	},
};