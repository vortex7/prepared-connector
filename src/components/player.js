const Scout = require("@scoutsdk/server-sdk")

class Player {                  
  constructor(options) {       
    this.options = options
  } 

  async getPlayer() {
    await Scout.configure({
      clientId: process.env.clientId,
      clientSecret: process.env.clientSecret,
      scope: "public.read"
    })

    let playerId
    try {
      let search = await Scout.players.search(this.options.identifier, this.options.platform, null, this.options.title)
      if(search.results && search.results.length > 0) {
        playerId = search.results[0].player.playerId
      }
    }
    catch(e) {
      console.log(e)
      return(null)
    }

    if(playerId) {
      console.log(`${this.options.identifier}: ${playerId}`)
      try {
        let player = await Scout.players.get(this.options.title, playerId, "*")
        console.log(JSON.stringify(player, null, 2))
        return player
      }
      catch(e) {
        console.log(e)
        return(null)
      }
    }
  }
}

module.exports = Player
