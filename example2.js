var LolClient = require('./lol-client');

var options = {
	region: 'na',
	username: '',
	password: '',
	version: '4.21.14_12_08_11_36',
	debug: true
};

var testKey;
var testGID;
var client = new LolClient(options);

var heartbeat = function() {
	client.heartbeat();
};

client.on('connection', function() {
	setInterval(heartbeat, 5000);
	client.getCurrentGameByName('Upu', function(err, res) {
		console.log("Got current game!")
		console.log(res.object.playerCredentials.object);
		testKey = res.object.playerCredentials.object.observerEncryptionKey;
		testGID = res.object.playerCredentials.object.gameId;
		console.log(testKey);

		//console.log(res.args[0].body);
		//printObject(res);
	});
	console.log("Successfully connected!");
	//console.log(encryptionKey);
	// Put other code in here, once the client has successfully connected. Queries, etc.
});

client.connect();

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  console.log(out);
}
///////////////////////////////////////////////////////////UWCoo0tqD1+QOlBFDxk0/fEgMjVamVL+
/*
var Observer = require('./node-spectate-test/lib/observer.js')
  , KeyframeParser = require('./node-spectate-test/lib/parser/keyframe.js')
  , co = require('co')

var na = new Observer('na')

//spectate(testGID);

na.getFeaturedGames(function (err, games) {
    if(err) {
        console.error(err)
        return
    }

    games[0].getMetadata(function(err, data, game) {
        console.log(game)
    })

    for(var i=0;i<games.length;i++)
        spectate(games[i])

})


/*na.getGame('1655934137', 'NA1', function(err, game) {
    game.startSpectate();
    game.getMetadata();
})




function spectate(game) {
	console.log('Spectating games!');
	console.log('Game ID: ' + game.id);

    var first = true
    game
        .on('keyframe.available', function(data) {
            console.log('new keyframe: ', data.id)
            console.log('Data ID: ' + data.id);
            this.startDownloadKeyframe('./download/' + game.id + '/keyframes/', data.id);
            var buffers = []
            var stream = data.download()
            stream.on('data', function(bfr) {
                buffers.push(bfr)
            })
            stream.on('end', function() {
                var full = Buffer.concat(buffers)
                console.log('loaded keyframe ' + data.id + '#'+ game.id +' Bytes: ' + full.length)
                try {
                    KeyframeParser().parse(full, dump);
                }
                catch(e) {
                    console.log(e)
                }

                function dump(data) {
                    console.log('time: ', data.time)
                    console.log('%s players:', data.players.length)
                    /*for(var pid in data.players) {
                        console.log("player data: %s - %s", data.players[pid].start, data.players[pid].end)
                        console.log("player[%s]: %s", data.players[pid].entity[0], data.players[pid].name)
                        //console.log(data.players[pid].rubish)
                        //console.log(data.players[pid].masteryPointsTotal)
                        //console.log(data.players[pid].items)
                    }*/
                    /*console.log('%s towers:', data.towers.length)
                    for(var tid in data.towers) {
                        if(data.towers[tid].itemHeader[1]) {
                            console.log(data.towers[tid].entity[0], data.towers[tid].name)
                            console.log(data.towers[tid].unknown)
                            console.log(data.towers[tid].itemHeader)
                            console.log(data.towers[tid].items)
                        }
                    }
                }
            })
        })
        .on('chunk.available', function(data) {
            console.log('new chunk: ', data.id);
            console.log('Data ID: ' + data.id);
			this.startDownloadChunk('./download/' + game.id + '/chunks/', data.id);
        })
        .on('end', function(data) {
            console.log('END')
        })
        .startSpectate()
    console.log('spectating game: ' + game.id + ' ' + game.region)
}
