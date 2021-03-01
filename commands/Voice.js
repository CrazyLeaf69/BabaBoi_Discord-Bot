const Discord = require('discord.js');
const speech = require('@google-cloud/speech');
const fs = require("fs")
const ytdl = require('ytdl-core');
let connection = "";
let dispatcher = "";
// kanske connection är problemet till "only one server" 

// write in terminal
// $env:GOOGLE_APPLICATION_CREDENTIALS="testing-speech-305723-119352bb231c.json"
// uptade ytdl >>> npm i ytdl-core@latest

module.exports = {
	name: 'voice',
	description: 'Enables voicerecognition',
	aliases: ['rec'],
	args: true,
	argsNeeded: false,
    executed: false,
	async execute(message, server) {
        // this.executed = true;
		if (message.voice.channel) {
            connection = await message.voice.channel.join();
            const audio = connection.receiver.createStream(message, {
                mode: "pcm",
                end: "silence"
            });
            
            const writer = audio.pipe(fs.createWriteStream(`./member-voiceLogs/VoiceLog_${message.user.username}.wav`));
            // main().catch(console.error);
            writer.on("finish", () => {
                fs.createReadStream(`./member-voiceLogs/VoiceLog_${message.user.username}.wav`)
                SpeechToText(message, server).catch(console.error);
            })
        }  else {
            message.reply('You need to join a voice channel first!');
        }
    
    },
}; 
// let currentTimestamp = "";
// speech to text function that is being called from module.exports
async function SpeechToText(message, server) {
    let transcription = "";
    try {
        // play("music", message)
        const client = new speech.SpeechClient();
        const filename = (`./member-voiceLogs/VoiceLog_${message.user.username}.wav`)
        
        const file = fs.readFileSync(filename);
        const audioBytes = file.toString("base64");

        const audio = {
            content: audioBytes
        };
        const config = {
            encoding: "LINEAR16",
            sampleRateHertz: 44100,
            languageCode: "sv-SV",
            audioChannelCount: 2
        };
        const request = {
            audio: audio,
            config: config
        };
        const [response] = await client.recognize(request);
        transcription = response.results.map(result => 
            result.alternatives[0].transcript).join("\n").toLowerCase();
        if (transcription != "") {
            // message.send(`What I heard: ${transcription}`).catch(console.error);
            console.log(`Transcription: ${transcription}`);
        }
    } catch (error) {
        console.log(error);
    }
    // ------------------------------------------------------------------------------------------------
    // --------------------------check the response ---------------------------------------------------
    // ------------------------------------------------------------------------------------------------
    // coomands
    const searchWords = transcription.split(" ").splice(1).join(" ");
    const word = transcription.split(" ");
    if (transcription.includes("speak")) {
        speak(message);
    }
    else if (word[0]=="play" && word[1]!="number") {
        play(searchWords, message, server);
    }
    else if (word[0]=="play" && word[1]=="number") {
        if (word[2]=="one") {
            queue[0] = {title: searchResults[0].title, url: searchResults[0].url};
        } else {
            queue[0] = {title: searchResults[word[2]-1].title, url: searchResults[word[2]-1].url};
        }
        console.log(queue);
        playQueue(message, server);
        recordAgain(message, server).catch(console.error);
    }
    else if (word[0]=="search") {
        search(searchWords, message, server);
    }
    else if (word[0]=="lägg"&&word[1]=="till"&&word[2]!=undefined) {
        let number;
        if (word[2]=="ett") {number = 0;}
        if (word[2]=="två") {number = 1;}
        if (word[2]=="tre") {number = 2;}
        if (word[2]=="fyra") {number = 3;}
        if (word[2]=="fem") {number = 4;}
        addToQueue(number);
        recordAgain(message, server).catch(console.error);
    }
    else if (transcription.includes("skip")||transcription.includes("next")) {
        try {
            if (queue.length > 0) {
                queue.shift();
            }
            playQueue(message, server);
        } catch (error) {
            console.log("queue empty");
        }
        // ------------------------------------------------------------------------- testa "next" "next"
        // playQueue(message, server).catch(dispatcher = "");
        // queue.shift();
        recordAgain(message, server).catch(console.error);
    }
    else if (transcription.includes("pause")||transcription.includes("pausa")) {
        pause(message);
    }
    else if (transcription.includes("resume")) {
        resume(message);
    }
    else {
        recordAgain(message, server).catch(console.error);
    }
}

// ------------------------------------------------------------------------------------------------
// --------------------------Commands--------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
let searchResults = [];
let queue = [];


async function speak(message, server) {
    var url = 'https://www.youtube.com/watch?v=U_cPir6MwLM';
    dispatcher = connection.play(ytdl(url), {filter: 'audioonly', quality: 'highest' });
    dispatcher.on('error', console.error);
    console.log("spoke");
    recordAgain(message, server)
}
async function play(search, message, server) {
    let url = "";
    const fetch = require("node-fetch");
    try {
        url = "https://www.youtube.com/watch?v=NCFg7G63KgI";
        await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
        .then(res => res.json()).then(data => {
            const items = data.items
            const videoId = items[0].id.videoId;
            url = `https://www.youtube.com/watch?v=${videoId}`;
            console.log(items[0].snippet.title);
            console.log(url);
            queue[0] = {title: items[0].snippet.title, url: url};
        });
        console.log(queue);
        playQueue(message, server);
        recordAgain(message, server).catch(console.error);
    } catch(err) {
        console.log(err);
    };
}

async function search(search, message, server) {
    let i = 0;
    let url = "";
    const fetch = require("node-fetch");
    try {
        searchResults = [];
        await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
        .then(res => res.json()).then(data => {
            const items = data.items;
            var embedResults = "";
            items.forEach(item => {
                if (item.id.kind == "youtube#video") {
                    const title = item.snippet.title;
                    const videoId = item.id.videoId;
                    url = `https://www.youtube.com/watch?v=${videoId}`;
                    searchResults.push({title: title, url: url});
                    i+=1
                    embedResults += `${i}: ${title}\n`;
                }
            });
            sendToBotChannel(server, `Searchresults for: "${search}"`, embedResults, "")
        });
    } catch(err) {
        console.log(err);
    };
    recordAgain(message, server).catch(console.error);   
}
function addToQueue(number) {
    queue.push({title: searchResults[number].title, url: searchResults[number].url});
    console.log(queue);
}
function pause(message, server) {
    dispatcher.pause(message);
    recordAgain(message, server).catch(console.error);
}
function resume(message, server) {
    dispatcher.resume(message);
    recordAgain(message, server).catch(console.error);
}
// ----------------------------------------------------------------------------------
// play queue
async function playQueue(message, server) {
    dispatcher = connection.play(ytdl(queue[0].url), {filter: 'audioonly', quality: 'highest' });
    sendToBotChannel(server,"", `**Now playing:** ${queue[0].title}`, `Requested by @${message.user.username}`)
    console.log("playing......");
    dispatcher.on("finish", () => {
        queue.shift();
        if (queue.length > 0) {
            playQueue(message, server);
        }
        else {
            console.log("queue epmty");
        }
    });
}

// make it possible to recordAgain when none of the commands is spoken
async function recordAgain(message, server) {
    if (message.voice.channel) {
        const audio = connection.receiver.createStream(message, {
            mode: "pcm",
            end: "silence"
        });
        const writer = audio.pipe(fs.createWriteStream(`./member-voiceLogs/VoiceLog_${message.user.username}.wav`));
        writer.on("finish", () => {
            fs.createReadStream(`./member-voiceLogs/VoiceLog_${message.user.username}.wav`)
            SpeechToText(message, server).catch();
        })
    }
}

function sendToBotChannel(server, title, description, footer) {
    server.channels.cache.filter((c) => c.type == 'text').forEach((textchannel) => {
        if (textchannel.name == "bot") {
            embed = new Discord.MessageEmbed()
            .setColor("#0036FF")
            .setTitle(title)
            .setDescription(description)
            .setFooter(footer)
            textchannel.send(embed);
        }
    })
}
