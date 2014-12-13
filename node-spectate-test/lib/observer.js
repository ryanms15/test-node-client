var request = require('request')
  , Game    = require('./game.js')

module.exports = Observer

var hostList = {
    "na":   "spectator.na.lol.riotgames.com:80",
    "euw":  "spectator.euw1.lol.riotgames.com:80",
    "eune": "spectator.eu.lol.riotgames.com:8088",
    "br":   "spectator.br.lol.riotgames.com:80",
    "lan":  "spectator.br.lol.riotgames.com:80",
    "rus":  "spectator.tr.lol.riotgames.com:80",
    "tur":  "spectator.tr.lol.riotgames.com:80",
    "pbe":  "spectator.pbe1.lol.riotgames.com:8088",
    "sk":   "QFKR1PROXY.kassad.in:8088",
    "tw":   "QFTW1PROXY.kassad.in:8088",
    "sea":  "qfsea1proxy.kassad.in:8088",
    'cr': 'dev.spectator.cloudreplays.net:8088'
}


function Observer(server) {
    if(!hostList[server] && server.length < 4) {
        throw new Error("Server not found")
    }

    if(!(this instanceof Observer)) {
        return new Observer(server)
    }

    this.host = hostList[server] || server
    console.log(this.host)
    this.baseUrl = 'http://' + this.host + '/observer-mode/rest/'
}


Observer.prototype.getFeaturedGames = function(cb) {

    var burl = this.baseUrl
    request.get(this.baseUrl + 'featured', function(err, res, body) {
        if(err)
            return cb(err)

        var games = JSON.parse(body)
        var objs = []
        for(var i=0;i<games.gameList.length;i++) {
            var game = new Game(games.gameList[i], burl)
            objs.push(game)
        }
        cb(null, objs)
    })

}

Observer.prototype.getGame = function(gameid, platform, cb) {
    var nfo = {
        gameId: gameid,
        platformId: platform
    }

    var game = new Game(nfo, this.baseUrl)
    cb(null, game)
}
