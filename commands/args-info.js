module.exports = {
	name: 'args-info',
    description: 'Arguments info!',
    args: true,
    usage: '<your argument>',
    argsNeeded: true,
	execute(message, args) {
		if (args[0] === 'foo') {
            return message.channel.send('bar')
        }
        message.channel.send(`Arguments: ${args}\nArgument length: ${args.length}`);
	},
};