module.exports = {
	name: 'ping',
	description: 'Ping!',
	aliases: '',
	args: true,
	argsNeeded: false,
	execute(message) {
		message.channel.send('Pong');
	},
};