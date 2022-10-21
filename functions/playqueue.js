const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const {
  getVoiceConnection,
  joinVoiceChannel,
  AudioPlayerStatus,
  createAudioResource,
  getNextResource,
  createAudioPlayer,
  NoSubscriberBehavior,
} = require("@discordjs/voice");

module.exports = {
  subscription: null,
  async execute(message, client, queue) {
    const voiceChannel = client.channels.cache.get("1000378228311068702");
    if (voiceChannel) {
      var botInChannel = false;
      voiceChannel.members.forEach(async (element) => {
        if (element.user.username == client.user.username) {
          botInChannel = true;
        }
      });
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      const player = createAudioPlayer();
      subscription = connection.subscribe(player);
      try {
        player.play(
          createAudioResource(
            ytdl(queue[0].url, {
              filter: "audioonly",
              quality: "highestaudio",
              highWaterMark: 1 << 25,
            })
          )
        );
      } catch (error) {
        console.log(error);
      }

      if (botInChannel == false) {
        sendEmbed(
          message,
          `Music Playback`,
          `Joining channel **${voiceChannel.name}**...\n
                    Now playing: [${queue[0].title}](${queue[0].url})\n Duration: ${queue[0].duration}`,
          ""
          //   `Requested by @${message.member.nickname || message.member.user.username}`
        );
      } else {
        sendEmbed(
          message,
          `Music Playback`,
          `Now playing: [${queue[0].title}](${queue[0].url})\n Duration: ${queue[0].duration}`,
          ""
          //   `Requested by @${message.member.nickname || message.member.user.username}`
        );
      }
      //dispatcher.setVolume(0.3);

      player.on(AudioPlayerStatus.Idle, () => {
        // queue.shift();
        if (queue.length > 0) {
          this.execute(message, client, queue);
        } else {
          player.stop();
          connection.destroy();
          sendEmbed(message, "", `Queue empty\nLeft voicechannel: **${voiceChannel.name}**`, "");
        }
      });
    } else {
      message.reply("You need to join a voice channel first!");
    }
  },
};

function sendEmbed(message, title, description, footer) {
  embed = new Discord.MessageEmbed().setColor("#0036FF").setTitle(title).setDescription(description).setFooter(footer);
  message.channel.send({ embeds: [embed] });
}
