module.exports = {
	name: 'givekalleyearsman',
	args: true,
	argsNeeded: false,
	execute(message) {
	    console.log("first")
	    console.log(message.mentions.users)
	    const kalle = message.mentions.users.get("248026739966476288")
	    if (kalle.username == "Sujej") {
	    	let testRole = message.guild.roles.cache.find(role => role.id == "716249696217202729")
	    	kalle.roles.add(testRole)
	    }
	    
	    console.log("second")
	},
};
