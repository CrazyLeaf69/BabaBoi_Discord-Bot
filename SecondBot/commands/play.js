module.exports = {
	name: 'play',
    description: 'Play some music!',
    usage: '<Youtube Link>',
    cooldown: '10',
    args: true,
	async execute(message, args, ) {
        const ytdl = require('ytdl-core');
            if (message.member.voice.channel) {
                url=(args[0]);
                let connection = await message.member.voice.channel.join();
                const dispatcher = connection.play(ytdl(url ,
                {filter: 'audioonly'}));

                dispatcher.on("finish", finish => {
                    connection = message.member.voice.channel.leave();
                });

            }   else {
                message.reply('You need to join a voice channel first');
            }
    },
};