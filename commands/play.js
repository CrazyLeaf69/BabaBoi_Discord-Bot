const fetch = require("node-fetch");
const playQueue = require("../playqueue.js")

module.exports = {
	name: 'play',
	description: 'play recorded audio',
	aliases: ['p'],
	args: true,
	argsNeeded: true,
	async execute(message, args, client, queue, searchresult) {
        await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${args}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
        .then(res => res.json()).then(async data=> {
            const items = data.items;
            const title = items[0].snippet.title
            const videoId = items[0].id.videoId;
            const url = `https://www.youtube.com/watch?v=${videoId}`;
            console.log(title);
            console.log(url);
            queue[0] = {title: items[0].snippet.title, url: url};
            console.log(queue);
            playQueue.execute(message, client, queue)
        });
    },
};