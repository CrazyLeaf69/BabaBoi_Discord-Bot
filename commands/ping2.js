module.exports = {
    slash: 'both',
    testOnly: true, 
    description: ' A simple ping pong command',
    callback: ({ message }) => {
        if (message) {
            if (message.content == '!ping') {
                message.reply('pong!')   
            }
        }
        return 'pong!!!'
    }
}