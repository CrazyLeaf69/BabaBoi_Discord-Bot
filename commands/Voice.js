const speech = require('@google-cloud/speech');
const fs = require("fs")
const ytdl = require('ytdl-core');

// write in terminal
// $env:GOOGLE_APPLICATION_CREDENTIALS="testing-speech-305723-119352bb231c.json"
// uptade ytdl >>> npm i ytdl-core@latest

module.exports = {
	name: 'voice',
	description: 'Enables voicerecognition',
	aliases: 'voi',
	args: true,
	argsNeeded: false,
	async execute(message) {
		if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const audio = connection.receiver.createStream(message.member, {
                mode: "pcm",
                end: "silence"
            });
            
            const writer = audio.pipe(fs.createWriteStream("./namnlös.wav"));
            // main().catch(console.error);
            writer.on("finish", () => {
                fs.createReadStream(`./namnlös.wav`)
                SpeechToText(message).catch(console.error);
            })
        }  else {
            message.reply('You need to join a voice channel first!');
        }
    
    },
}; 

// speech to text function that is being called from module.exports
async function SpeechToText(message) {
    try {
        // play("music", message)
        const client = new speech.SpeechClient();
        const filename = (`./namnlös.wav`)
        
        const file = fs.readFileSync(filename);
        const audioBytes = file.toString("base64");

        const audio = {
            content: audioBytes
        };
        const config = {
            encoding: "LINEAR16",
            sampleRateHertz: 48000,
            languageCode: "en-US",
            audioChannelCount: 2
        };
        const request = {
            audio: audio,
            config: config
        };
        const [response] = await client.recognize(request);
        const transcription = response.results.map(result => 
            result.alternatives[0].transcript).join("\n").toLowerCase();
        console.log(`Transcription: ${transcription}`);
        return transcription;
    } catch (error) {
        console.log(error);
        recordAgain(message);
    }
    // ------------------------------------------------------------------------------------------------
    // --------------------------check the response ---------------------------------------------------
    // ------------------------------------------------------------------------------------------------
    // coomands
    if (transcription.includes("speak")) {
        // wakeUp(trancription, message)
        speak(message)
    }
    else if (transcription.split(" ")[0]=="play") {
        const searchWords = transcription.split(" ").splice(1).join(" ");
        console.log(searchWords);
        play(searchWords, message);
    }
    else {
        recordAgain(message);
        console.log("say again");
    }
}

// speak bababoi (not working)
async function speak(message) {
    var url = 'https://www.youtube.com/watch?v=U_cPir6MwLM';
    let connection = await message.member.voice.channel.join();
    let dispatcher = await connection.play(ytdl(url), {filter: 'audioonly', quality: 'highest' });
    dispatcher.on('error', console.error);
    console.log("spoke");
    recordAgain(message)
}

// play music
async function play(search, message) {
    let url = "";
    const fetch = require("node-fetch");
    try {
        await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
        .then(res => res.json()).then(data => {
            const items = data.items
            const videoId = items[0].id.videoId;
            url = `https://www.youtube.com/watch?v=${videoId}`;
            console.log(items[0].snippet.title);
            console.log(url);
        
        });
        let connection = await message.member.voice.channel.join();
        let dispatcher = connection.play(ytdl(url), {filter: 'audioonly', quality: 'highest' });
        dispatcher.on('error', console.error);
        recordAgain(message).catch(console.error);
    } catch(err) {
        console.log(err);
    };   
}
// 


// make it possible to recordAgain when none of the commands is spoken
async function recordAgain(message) {
    if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        const audio = connection.receiver.createStream(message.member, {
            mode: "pcm",
            end: "silence"
        });
        const writer = audio.pipe(fs.createWriteStream("./namnlös.wav"));
        writer.on("finish", () => {
            fs.createReadStream(`./namnlös.wav`)
            SpeechToText(message).catch(console.error);
        })
    }
}
function wakeUp(transcription, message) {
    if (transcription.includes("speak")) {
        speak(message);
    }
    else if (transcription.split(" ")[0]=="play") {
        const searchWords = transcription.split(" ").splice(1).join(" ");
        console.log(searchWords);
        play(searchWords, message);
    }
    recordAgain(message)
}