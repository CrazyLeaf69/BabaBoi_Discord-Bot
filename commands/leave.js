module.exports = {
	name: 'leave',
	description: 'Tell the bot to leave current voicechannel',
	aliases: 'l',
	args: true,
	argsNeeded: false,
	async execute(message, args, client, queue, searchResults) {
        const voiceChannel = message.member.voice.channel;
        voiceChannel.leave();
        message.channel.send(`Left voicechannel: **${voiceChannel.name}**`)
    }
};