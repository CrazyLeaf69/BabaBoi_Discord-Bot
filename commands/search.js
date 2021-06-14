const Discord = require('discord.js');
const fetch = require("node-fetch");
const fs = require("fs")

// var searchResJson = require('../searchresults.json');

module.exports = {
	name: 'search',
	description: 'Search music from Youtube',
	aliases: ['s'],
	args: true,
	argsNeeded: true,
	async execute(message, args, client, queue, searchRes) {
        let i = 0;
        let url = "";
        let searchResults = [];
        data = [];
        await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${args}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
        .then(res => res.json()).then(data => {
            const items = data.items;
            var embedResults = "";
            items.forEach(item => {
                if (item.id.kind == "youtube#video") {
                    const title = item.snippet.title;
                    const videoId = item.id.videoId;
                    url = `https://www.youtube.com/watch?v=${videoId}`;
                    searchResults.push({title, url});
                    i+=1
                    embedResults += `${i}: ${title}\n`;
                }
            });
            sendEmbed(message, `Searchresults for: "${args}"`, embedResults, "")
        });
        fs.writeFileSync('searchresults.json', `${JSON.stringify(searchResults)}`);
    }
};

function sendEmbed(message, title, description, footer) {
    embed = new Discord.MessageEmbed()
        .setColor("#0036FF")
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer)
    message.channel.send(embed)
}