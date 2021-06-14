module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: true,
	argsNeeded: false,
	execute(message) {
		message.channel.send('Pong');
	},
};