// const fs = require("fs")
// module.exports = {
// 	name: 'play',
// 	description: 'play recorded audio',
// 	aliases: 'p',
// 	args: true,
// 	argsNeeded: false,
// 	async execute(message, args) {
// 		if (message.member.voice.channel) {
//             const connection = await message.member.voice.channel.join();
//             const stream = fs.createReadStream(`./recorded.pcm`)

//             const dispatcher = connection.play(stream, {
//                 type: "converted"
//             });

//             dispatcher.on("finish", () => {
//                 message.member.voice.channel.leave();
//                 return console.log("finished playing")
//             })
//         }  else {
//             message.reply('You need to join a voice channel first!');
//         }
    
//     },
// }; 