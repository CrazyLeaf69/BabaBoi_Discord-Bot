const { execute } = require("./help");

module.exports = {
    name: 'server',
    aliases: 'server-info',
    description: 'Wiew info about the server',
    args: true,
    argsNeeded: false,
    execute(message, args) {
        message.channel.send(`This server's name is: ${message.guild.name}`);
    }
}