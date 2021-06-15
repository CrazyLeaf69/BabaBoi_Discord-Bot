const fs = require('fs');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fetch = require("node-fetch");
const { prefix, token } = require('./config.json');
const decode = require("./functions/decode_string.js")

const guildId = '693042214875430954'
// 693042214875430954 cool club
// 760980566652616774 testserver

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.MemberStatus = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

let searchResults = [];
let queue = [];

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`)

    const commands = await getApp(guildId).commands.get()
    // console.log(commands)

    // to delete command do this
    // await getApp(guildId).commands('853015112965554207').delete()

    // to delete all commands do this
    // commands.forEach(async element => {
    //     await getApp(guildId).commands(element.id).delete()
    // });

    // await getApp(guildId).commands.post({
    //     data: {
    //         name: 'leave',
    //         description: 'Leave Voicechannel',
    //     },
    // })

    // await getApp(guildId).commands.post({
    //     data: {
    //         name: 'play',
    //         description: 'Play a song from Youtube by search or url',
    //         options: [
    //             {
    //                 name: 'title',
    //                 description: 'the song',
    //                 required: true,
    //                 type: 3
    //             }
    //         ]
    //     },
    // })

    // await getApp(guildId).commands.post({
    //     data: {
    //         name: 'search',
    //         description: 'Search for a song from Youtube and recieve top 5 results',
    //         options: [
    //             {
    //                 name: 'title',
    //                 description: 'Search words',
    //                 required: true,
    //                 type: 3
    //             }
    //         ]
    //     },
    // })
    // await getApp(guildId).commands.post({
    //     data: {
    //         name: 'addfromsearch',
    //         description: 'Add a song from your searchresult',
    //         options: [
    //             {
    //                 name: 'number',
    //                 description: 'Number 1-5',
    //                 required: true,
    //                 type: 3
    //             }
    //         ]
    //     },
    // })
    // await getApp(guildId).commands.post({
    //     data: {
    //         name: 'addtoqueue',
    //         description: 'Search for a song and add it to the queue',
    //         options: [
    //             {
    //                 name: 'title',
    //                 description: 'Title of the song',
    //                 required: true,
    //                 type: 3
    //             }
    //         ]
    //     },
    // })

    // await getApp(guildId).commands.post({
    //     data: {
    //         name: 'skip',
    //         description: 'skip a song in the queue',
    //     },
    // })

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { name, options } = interaction.data

        const command = name.toLowerCase()

        const args = {}

        if (options) {
            for (const option of options) {
                const { name, value } = option
                args[name] = value
            }
        }

        console.log(args);
        
        console.log(command);
        if (command === 'ping') {
            reply(interaction, 'pong')
        }
        else if (command === 'play') {
            play(args.title, interaction)
        }
        else if (command === 'search') {
            search(args.title, interaction)
        }
        else if (command === 'addfromsearch') {
            addFromSearch(args.number, interaction)
        }
        else if (command === 'addtoqueue') {
            addToQueue(args.title, interaction)
        }
        else if (command === 'skip') {
            if (queue.length > 0) {
                queue.shift();
                playQueue(interaction)
            }
            else {
                reply(interaction, "queue empty")
            }
        }
        else if (command === 'leave') {
            leave(interaction)
        }
        else if (command === 'pause') {
            pause(args.title, interaction)
        }
        else if (command === 'resume') {
            resume(args.title, interaction)
        }
    })
});

const reply = async (interaction, response) => {
    let data = {
        content: response,
    }
    if (typeof response === 'object') {
        data = await creatAPIMessage(interaction, response)
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data
        },
    })
}

const creatAPIMessage = async (interaction, content) => {
    const { data, files } = await Discord.APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
    )
        .resolveData()
        .resolveFiles()
    return { ...data, files }
}

async function play(search, interaction) {
    await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
    .then(res => res.json()).then(async data=> {
        const items = data.items;
        const title = await decode.execute(items[0].snippet.title)
        const videoId = items[0].id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(title);
        console.log(url);
        queue[0] = {title: items[0].snippet.title, url: url};
        console.log(queue);
        playQueue(interaction)
    });
};

async function search(search, interaction) {
    let i = 0;
    let url = "";
    searchResults = [];
    await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
    .then(res => res.json()).then(async data => {
        const items = data.items;
        var embedResults = "";
        await Promise.all(items.map(async (item) => {
            if (item.id.kind == "youtube#video") {
                const title = item.snippet.title;
                const videoId = item.id.videoId;
                url = `https://www.youtube.com/watch?v=${videoId}`;
                searchResults.push({title: title, url: url});
                i+=1
                embedResults += `${i}: ${title}\n`;
            }
        }));
        sendEmbed(interaction, `Searchresults for: "${search}"`, embedResults, "")
    });
};

function addFromSearch(number, interaction) {
    var rawdata = fs.readFileSync('./searchresults.json')
    let array = JSON.parse(rawdata);
    number-=1
    let title;
    let url
    if (searchResults[number] == undefined) {
        title = array[number].title
        url = array[number].url
    } else {
        title = searchResults[number].title
        url = searchResults[number].url
    }
    console.log(title);
    queue.push({title: title, url: url});
    let queueTitles = "";
    for (let i = 0; i < queue.length; i++) {
        const song = queue[i];
        queueTitles += `${i+1}: ${song.title}\n`;
    }
    console.log(queue);
    sendEmbed(interaction, "Current queue:", queueTitles, "");
    if (queue.length == 1) {
        playQueue(interaction)
    }
}
async function addToQueue(search, interaction) {
    await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
    .then(res => res.json()).then(async data=> {
        const items = data.items;
        const title = await decode.execute(items[0].snippet.title)
        const videoId = items[0].id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(title);
        console.log(url);
        queue.push({title: title, url: url});
    });
    let queueTitles = "";
    for (let i = 0; i < queue.length; i++) {
        const song = queue[i];
        queueTitles += `${i+1}: ${song.title}\n`;
    }
    console.log(queue);
    sendEmbed(interaction, "Current queue:", queueTitles, "");
    if (queue.length == 1) {
        playQueue(interaction)
    }
}
function leave(interaction) {
    const guild = client.guilds.cache.get(interaction.guild_id)
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;
    voiceChannel.leave();
    sendEmbed(interaction, '', `Left voicechannel: **${voiceChannel.name}**`, '')
    reply(interaction, `Left voicechannel: **${voiceChannel.name}**`)
}

async function playQueue(interaction) {
    const guild = client.guilds.cache.get(interaction.guild_id)
    const member = guild.members.cache.get(interaction.member.user.id);
    const voiceChannel = member.voice.channel;
    if (voiceChannel) {
        var botInChannel = false
        voiceChannel.members.forEach(async element => {
            if (element.user.username == client.user.username) {
                botInChannel = true;
            }
        });
        let connection = await voiceChannel.join();
        const dispatcher = connection.play(ytdl(queue[0].url,
            { filter: 'audioonly' }));
    
        if (botInChannel == false) {
            sendEmbed(interaction, 
                `Music Playback`,
                `Joining channel **${voiceChannel.name}**...\n
                Now playing: [${queue[0].title}](${queue[0].url})`,
                `Requested by @${interaction.member.nick || interaction.member.user.username}`)
        }
        else {
            sendEmbed(interaction, 
                `Music Playback`,
                `Now playing: [${queue[0].title}](${queue[0].url})`,
                `Requested by @${interaction.member.nick || interaction.member.user.username}`)
        }
        //dispatcher.setVolume(0.3);

        dispatcher.on("finish", () => {
            voiceChannel.leave();
            queue.shift();
            if (queue.length > 0) {
                playQueue(interaction);
            }
            else {
                sendEmbed(interaction, "", `Queue empty\nLeft voicechannel: **${voiceChannel.name}**`, "")
            }
        });

    } else {
        reply(interaction, 'You need to join a voice channel first!');
    }
};
function sendEmbed(interaction, title, description, footer) {
    embed = new Discord.MessageEmbed()
        .setColor("#0036FF")
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer)
    reply(interaction, embed)
}

client.login(token)

client.on('message', async message => {

    // fortnite earrape
    if (message.content.includes("fortnite")) {
        if (message.member.voice.channel) {
            let connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=hjSlY2iBXuw',
                { filter: 'audioonly' }));

            //dispatcher.setVolume(0.3);

            dispatcher.on("finish", finish => {
                connection = message.member.voice.channel.leave();
            });

        }
    }

    if (message.content.substring(0, 1) == prefix && message.guild.id != "651518721327628308") {
        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.args && !args.length && command.argsNeeded == true) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
            //return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            //---------------------------------------- alla send functioner behöver fixas ------------------------------------------------------
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.\nCooldown: ${command.cooldown} Seconds`);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        try {
            command.execute(message, args.join(" "), client, queue, searchResults);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!')
        }
    }

});