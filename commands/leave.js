module.exports = {
  name: "leave",
  description: "Tell the bot to leave current voicechannel",
  aliases: ["l"],
  args: true,
  argsNeeded: false,
  async execute(message, args, client, queue, searchResults) {
    // const voiceChannel = message.member.voice.channel;
    const voiceChannel = client.channels.cache.get("1000378228311068702");
    const voice = require("@discordjs/voice");
    voice.getVoiceConnection(message.guild.id).disconnect();
    message.channel.send(`Left voicechannel: **${voiceChannel.name}**`);
    queue = [];
  },
};
