module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: true,
	execute(message) {
		message.channel.send('Pong');
	},
};