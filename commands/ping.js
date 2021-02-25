module.exports = {
	name: 'ping',
	description: 'Ping!',
	aliases: 'p',
	args: true,
	argsNeeded: false,
	execute(message) {
		message.channel.send('Pong');
	},
};