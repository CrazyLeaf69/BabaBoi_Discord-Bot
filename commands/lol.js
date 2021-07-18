const Discord = require('discord.js');
module.exports = {
	name: 'lol',
	description: 'Witch champion to pick',
	args: true,
	argsNeeded: true,
	execute(message, args) {
		//class="map-countdown"
		//website = https://apexmap.kuroi.io
		const fetch = require("node-fetch");
		const cheerio = require("cheerio");
		try {
			fetch("https://www.counterstats.net/league-of-legends/" + args[0]).then(res => res.text())
			.then(html => {
				const $ = cheerio.load(html)

				const box = $('.champ-box.ALL')
				// find titles
				const titles = box.find("h3").text()
				title1 = titles.substring(0,19 + args[0].split("").length)
				title2 = titles.substring(title1.split("").length,title1.split("").length + 20 + args[0].split("").length)
				champname = title1.substring(19)

				// find champion picture
				const self_clear = $('.self-clear.champ-head')
				const wrap = self_clear.find('.circle-wrap')
				const span = wrap.find('span')
				const pic = span.find('img').attr('src')
				
				var percentageList = []
				var array = [];

				// get champions
				const a = box.find("a")
				// for each <a> tag
				a.each(function() {
					// champ
					const champ = $(this).find(".inset")
					const AltAttr = champ.find("img").attr("alt")
					// if champ is undefiened it will look for the rows below the big ones
					if (AltAttr == undefined){
						const listchamp = $(this).find(".stats-bar")
						const bar = listchamp.find("em")
						const img = bar.find("img").attr("alt")
						// push champ to array
						array.push(img)

						// push winrate to list
						const winrate = listchamp.find("b").text()
						percentageList.push(winrate)
					}
					else {
						// push champname to array (the 3 big ones)
						array.push(AltAttr)
						
						// push winrate to list
						const winrate = $(this).find(".percentage").text()
						percentageList.push(winrate)
					}
				});

				// counter var
				var c=0
				// k= the amount of big pics that have been shown
				let k=0 

				// push to best/worst lists from array with a for loop
				best = []
				worst = []
				for (let i = 0; i < array.length; i++) {
					const element = array[i];
					// splits centence into words
					var name = element.split(" ")
					// the first 6
					if (i<6) {
						// 3 from top
						if (name[0] == "Counter") {
							k++
							// push name to best list
							best.push(name[3] + ": " + percentageList[i])
						}
						// 3 from below
						else {
							// push name to best list
							best.push(name[0] + ": " + percentageList[i])
						}
					}
					else{
						// when encounters a big pic
						if (name[0] == "Counter") {
							k++
							// only if 6 big pictures have been shown
							if (k <= 6) {
								c = parseInt(i)
								// push name to worst list
								worst.push(name[3] + ": " + percentageList[i])
							}	
						}
						// if i = 3 above the last shown big picture
						else if (i<=(+c + +3)){
							// push name to worst list
							worst.push(name[0] + ": " + percentageList[i])
						}
					}
				}
				// the embed itself
				const embed = new Discord.MessageEmbed()
                .setTitle('Counter picks for ' + champname + ":")
				.setColor("#0036FF")
				.setThumbnail(pic)
				.addFields(
					{ name: title1, value: best, inline: true},
					{ name: title2, value: worst, inline: true}
				)
				// Finally send the embed in the same channel
				message.channel.send(embed)
				
			});	
		} catch (error) {
			console.error();
		}
	}
};