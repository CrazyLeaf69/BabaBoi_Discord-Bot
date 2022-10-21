const { createAudioPlayer, getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "pausa",
  description: "Pausa Musiken!",
  args: true,
  argsNeeded: false,
  execute() {
    const connection = getVoiceConnection("693042214875430954");
    connection.state.subscription.player.pause();
  },
};
