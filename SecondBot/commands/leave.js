const { prefix } = require('../config.json');
module.exports = {
    name: "leave",
    execute(message) {
        connection = message.member.voice.channel.leave();
    }
}
