const { prefix } = require('../config.json');
module.exports = {
    name: "leave",
    argsNeeded: false,
    execute(message) {
        connection = message.member.voice.channel.leave();
    }
}
