const Discord = require('discord.js');

module.exports = {
	name: 'check_lesson',
	description: 'Check next lesson of TE19D',
	aliases: ['check', 'next'],
	args: true,
	argsNeeded: false,
	async execute(message) {
	    const { data } = require('./../chema.json');
		
            var date = new Date();
            var day = date.getDay();
            var h = date.getHours();
            var min = date.getMinutes();
        
            // the amount of minutes that has passed;
            var current = (h*60) + min + 60;
        
            // array of all lesson objects
            array = data.lessonInfo
            // console.log(array)
        
            // ordered and unordered lists
            var orderedLesTime = [];
            var unorderedLesTime = [];
            var orderedLessons = [];
            var unordedLessons = [];
        
        
            array.forEach(element => {
                const dayOfWeek = element.dayOfWeekNumber;
                const lesson = element.texts[0];
        
                // here i need to get hours and minutes into minutes
                const timeStart = element.timeStart.split(":");
                const StartInMinutes = +timeStart[0]*60 + +timeStart[1]
                if (day == dayOfWeek) {
                    orderedLesTime.push(StartInMinutes)
                    unorderedLesTime.push(StartInMinutes)
                    unordedLessons.push("Nästa lektion är: " + lesson + " och börjar: " + timeStart[0] + ":" + timeStart[1])
                }
            });
            orderedLesTime.sort(function(a, b) {
                return a - b;
            });
        
            if (orderedLesTime[0] == 480) {
                orderedLesTime.shift()
            }
        
            for (let i = 0; i < orderedLesTime.length; i++) {
                const element = orderedLesTime[i];
                const currentObj = element;
                for (let i = 0; i < unorderedLesTime.length; i++) {
                    const element = unorderedLesTime[i];
                    if (element == currentObj) {
                        orderedLessons.push(unordedLessons[i])
                    }
                }
            }
            for (let i = 0; i < orderedLesTime.length; i++) {
                const element = orderedLesTime[i];
                if (current <= element) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(orderedLessons[i])
                        .setColor("#0036FF")
                    return message.channel.send(embed);
                }
            }
        }
        
    };
