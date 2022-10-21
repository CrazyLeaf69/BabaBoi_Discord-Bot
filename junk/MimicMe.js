// const fs = require("fs")

// module.exports = {
// 	name: 'mimic',
// 	description: 'mimics what u just said',
// 	aliases: ['m'],
// 	args: true,
// 	argsNeeded: false,
// 	async execute(message) {
// 		if (message.member.voice.channel) {
//             const connection = await message.member.voice.channel.join();
//             const receiver = connection.receiver.createStream(message.member, {
//                 mode: "pcm",
//                 end: "silence"
//             });
            
//             const writer = receiver.pipe(fs.createWriteStream("./recorded.pcm"));
//             writer.on("finish", () => {
//                 const stream = fs.createReadStream(`./recorded.pcm`)
//                 const dispatcher = connection.play(stream, {
//                     type: "converted"
//                 });

//                 dispatcher.on("finish", () => {
//                     message.member.voice.channel.leave();
//                 });
//             })
//         }  else {
//             message.reply('You need to join a voice channel first!');
//         }
    
//     },
// }; 