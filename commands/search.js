const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const decode = require("../functions/decode_string");
const FancyTimeFormat = require("../functions/FancyTimeFormat.js");

module.exports = {
  name: "search",
  description: "Search music from Youtube",
  aliases: ["s"],
  args: true,
  argsNeeded: true,
  async execute(message, args, client, queue, searchRes) {
    let i = 0;
    let searchResults = [];
    data = [];
    await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${args}&type=video&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`
    )
      .then((res) => res.json())
      .then(async (data) => {
        const items = data.items;
        var embedResults = "";
        await Promise.all(
          items.map(async (item) => {
            if (item.id.kind == "youtube#video") {
              const title = await decode.execute(item.snippet.title);
              const videoId = item.id.videoId;
              const url = `https://www.youtube.com/watch?v=${videoId}`;
              let duration;
              await fetch(
                `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyD4q3HFuGrKvo7qpB0-wsJYWnKiWwZGILM`
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
              searchResults.push({ title, url, duration: duration });
              i += 1;
              embedResults += `${i}: ${title}\n`;
            }
          })
        );
        sendEmbed(message, `Searchresults for: "${args}"`, embedResults, "");
      });
    fs.writeFileSync("searchresults.json", `${JSON.stringify(searchResults)}`);
  },
};

function sendEmbed(message, title, description, footer) {
  embed = new Discord.MessageEmbed().setColor("#0036FF").setTitle(title).setDescription(description).setFooter(footer);
  message.channel.send({ embeds: [embed] });
}
