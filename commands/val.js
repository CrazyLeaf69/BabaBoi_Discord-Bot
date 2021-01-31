module.exports = {
	name: 'val',
	aliases: ['v'],
	description: 'Show rank of player',
	args: true,
	argsNeeded: false,
	execute(message, args) {
		//class="map-countdown"
		//website = https://apexmap.kuroi.io
		const acc = args[0].split("#")
		const fetch = require("node-fetch");
		const cheerio = require("cheerio");
		try {
			fetch("https://tracker.gg/valorant/profile/riot/" + acc[0] +"%23" + acc[1] + "/overview").then(res => res.text())
			.then(html => {
				const $ = cheerio.load(html)
				// console.log(html)
				const title = $(".valorant-highlighted-stat__value")
				const og = title.text()
				message.channel.send(og.substring(0,og.split("").length-4))
			});	
		} catch (error) {
			console.error();
		}

	}
};
// valorant-highlighted-stat__value

// var str = 1437203995000;
// str = str.toString();
// console.log("Original data: ",str);
// str = str.slice(0, -3);
// str = parseInt(str);
// console.log("After truncate: ",str);