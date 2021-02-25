module.exports = {
    name: 'delete',
    aliases: ['prune', 'del'],
    description: 'Delete messages above',
    args: true,
    usage: '<number>',
    cooldown: 5,
    argsNeeded: true,
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('invalid number')
        } else if (amount <= 1 || amount >= 50) {
            return message.reply('you need to input a number between 0 and 50.');
        }
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('there was an error trying to prune messages in this channel!');
        });
        /*message.channel.type === 'dm' .catch(err => {
            console.error(err);
        });*/
	},
};