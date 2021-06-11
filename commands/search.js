module.exports = {
    slash: 'both',
    testOnly: true, 
    description: 'Search for a song from Youtube',
    callback: ({ message }) => {
        if (message) {
            if (message.content == '!ping') {
                message.reply('pong!')   
            }
        }
        return 'pong!!!'
    }
}