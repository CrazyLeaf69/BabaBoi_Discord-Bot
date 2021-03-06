// const fs = require("fs")
// module.exports = {
// 	name: 'play',
// 	description: 'play recorded audio',
// 	aliases: 'p',
// 	args: true,
// 	argsNeeded: false,
// 	async execute(message, args) {
// 		if (message.member.voice.channel) {
//             url = message.content.split(" ").splice(1).join(" ")
//             const connection = await message.member.voice.channel.join();
//             const stream = ytdl(url, connection);

//             const dispatcher = connection.play(stream);

//             dispatcher.on("finish", () => {
//                 return message.channel.play("finished playing")
//             })
//         }  else {
//             message.reply('You need to join a voice channel first!');
//         }
    
//     },
// }; 