const fetch = require("cross-fetch");
const playQueue = require("../functions/playqueue.js");
const decode = require("../functions/decode_string.js");
const FancyTimeFormat = require("../functions/FancyTimeFormat.js");

module.exports = {
  name: "play",
  description: "play recorded audio",
  aliases: ["p"],
  args: true,
  argsNeeded: true,
  cooldown: 3,
  async execute(message, args, client, queue, searchresult) {
    await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${args}&type=video&key=AIzaSyDZ3aMruDkwKkXxLA9v9v_AoGZpboIE0Dc`
    )
      .then((res) => res.json())
      .then(async (data) => {
        const items = data.items;
        const title = await decode.execute(items[0].snippet.title);
        const videoId = items[0].id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        let duration;
        await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyDZ3aMruDkwKkXxLA9v9v_AoGZpboIE0Dc`
        )
          .then((res) => res.json())
          .then(async (data) => {
            const time = data.items[0].contentDetails.duration;
            let formattedTime;
            if (time.includes("H")) {
              formattedTime = time.replace("PT", "").replace("H", ":").replace("M", ":").replace("S", "");
            } else if (!time.includes("H")) {
              formattedTime = time.replace("PT", "").replace("M", ":").replace("S", "");
            } else if (!time.includes("M")) {
              formattedTime = time.replace("PT", "").replace("S", "");
            }
            const fT = formattedTime.split(":");
            const H = parseInt(fT[fT.length - 3]);
            const M = parseInt(fT[fT.length - 2]);
            const S = parseInt(fT[fT.length - 1]);
            const TimeInSeconds = (H ? H * 3600 : 0) + (M ? M * 60 : 0) + S;
            duration = FancyTimeFormat.execute(TimeInSeconds);
          });
        queue[0] = { title: title, url: url, duration: duration };
        console.log(queue);
        playQueue.execute(message, client, queue);
      });
  },
};
