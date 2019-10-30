const Scout = require("@scoutsdk/server-sdk")
const _ = require("lodash")

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
      console.log(`Retrieving ${this.options.identifier}: ${playerId}`)
      try {
        let data = await Scout.players.get(this.options.title, playerId, "*")
        
        let metadata = _.keyBy(data.segments[0].metadata, "key")

        let stats = {}         
        data.stats.forEach((stat) => {  
          stats[stat.metadata.key] = {    
            value: stat.value, 
            displayValue: stat.displayValue 
          }                    
        })
  
        let player = {         
          name: this.options.identifier,       
          image: `${process.env.destinyUrl}/${metadata.emblemPath.value}`,
          stats: stats         
        }

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
