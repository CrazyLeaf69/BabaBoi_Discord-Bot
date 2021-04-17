module.exports = {
    name: 'fortnite',
    aliases: ['f'],
    description: 'Earrape',
    cooldown: 10,
    guildOnly: true,
    async execute(message, args) {
        const ytdl = require('ytdl-core');
        if (message.member.voice.channel) {
            let connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=hjSlY2iBXuw',
            {filter: 'audioonly'}));
            
            //dispatcher.setVolume(0.3);
            
            dispatcher.on("finish", finish => {
                connection = message.member.voice.channel.leave();
            });
            
        }  else {
            message.reply('You need to join a voice channel first!');
        }
    
    },
}; 