const fetch = require("cross-fetch");
const FancyTimeFormat = require("../functions/FancyTimeFormat.js");

module.exports = {
    async execute(videoId) {
        await fetch(`https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`)
            .then(res => res.json()).then(async data=> {
                const time = (data.items[0].contentDetails.duration);
                let formattedTime;
                if (time.includes("H")) {
                    formattedTime = time.replace("PT","").replace("H",":").replace("M",":").replace("S","")
                }
                else if (!time.includes("H")) {
                    formattedTime = time.replace("PT","").replace("M",":").replace("S","")
                }
                else if (!time.includes("M")) {
                    formattedTime = time.replace("PT","").replace("S","")
                }
                const fT = formattedTime.split(":")
                const H = parseInt(fT[fT.length-3]); 
                const M = parseInt(fT[fT.length-2]); 
                const S = parseInt(fT[fT.length-1]);
                const TimeInSeconds = (H ? H*3600 : 0)+(M ? M*60 : 0)+S
                return FancyTimeFormat.execute(TimeInSeconds);
            });
    }

}