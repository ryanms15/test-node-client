var request = require('request')
  , moment  = require('moment')
  , http    = require('http')
  , zlib    = require('zlib')
  , crypto  = require('crypto')
  , mkdirp  = require('mkdirp')
  , fs      = require('fs')
  , helpers = require('./helper.js')
  , co      = require('co')
  , util    = require('util')
  , events  = require('events')
  , KeyFrame = require('./keyframe.js')
  , Chunk    = require('./chunk.js')

module.exports = Game

var chunkStatus = [];
var chunkdata;
var testGameID;
var chunkExists;
var requestMade = {};


util.inherits(Game, events.EventEmitter)

var mapIds = {
    1: "Summoner's Rift"
}

function Game(info, baseUrl) {

    events.EventEmitter.call(this)

    this.info = info
    this.baseUrl = baseUrl

    this.id        = info.gameId
    testGameID     = info.gameId
    requestMade.testGameID = {};
    requestMade.testGameID.chunks = {};
    requestMade.testGameID.keyframes = {};
    this.region    = info.platformId

    if(info.gameStartTime) {
        this.startTime = new Date(info.gameStartTime)
    }
    if(info.mapId) {
        this.map       = mapIds[info.mapId] || 'unkown(#' + info.mapId + ')'
    }
    this.mode      = info.gameMode || undefined
    this.type      = info.gameType || undefined
    this.summoners = info.participants || undefined
    this.banned    = info.bannedChampions || undefined
    this.createTime = undefined

    this.biggestKeyFrameId = 0
    this.biggestChunkId    = 0

    this.chunks = []
    this.keyframes = []

    this.obsKey = undefined
    if(info.obsKey) {
        this.obsKey = info.obsKey
    } else if(info.observers) {
        this.obsKey = info.observers.encryptionKey || undefined
    }
    if(this.obsKey) {
        this.cryptoKey = decrypt(this.id, this.obsKey)
    }
}

Game.prototype.setObserverKey = function(key) {
    this.obsKey = key
    this.cryptoKey = decrypt(this.id, key)
}

Game.prototype.getMetadata = function(cb) {
    console.log('Getting Metadata!');
    var url = this.baseUrl + 'consumer/getGameMetaData/' + this.region + '/' + this.id + '/1/token'
    cb = cb || function() {}
    request.get(url, function(err, res, body) {
        if(err) {
            return cb(err)
        }
        try {
            var data = JSON.parse(body)
        } catch(e) {
            console.error(url)
            console.error(e)
            console.error(body)
            return
        }
        this.readMetadata(data)
        console.log(this);
        cb(null, data, this)
    }.bind(this))
}

Game.prototype.readMetadata = function(data) {
    this.startTime  = helpers.parseRiotTime(data.startTime)
    this.createTime = helpers.parseRiotTime(data.createTime)
    this.ended      = !!data.gameEnded
}

Game.prototype.getLastChunkInfo = function(cb) {
    var url = this.baseUrl + 'consumer/getLastChunkInfo/' + this.region + '/' + this.id + '/1/token'
    cb = cb || function() {}
    request.get(url, function(err, res, body) {

        if(err) {
            return cb(err)
        }
        try {
            var data = JSON.parse(body)
        } catch(e) {
            console.error(e)
            console.error(body)
            return
        }
        cb(null, data, this)
    }.bind(this))
}

Game.prototype.startSpectate = function() {
    console.log('Polling for chunk!');
    this.pollForChunk()
}

Game.prototype.pollForChunk = co(function *() {
    var result = yield this.getLastChunkInfo.bind(this)
    var chunkdata = result[0]
    if(chunkdata.keyFrameId > this.biggestKeyFrameId) {
        var kf = new KeyFrame(this, chunkdata.keyFrameId, chunkdata)
        this.biggestKeyFrameId = chunkdata.keyFrameId
        this.keyframes[chunkdata.keyFrameId] = kf
        this.emit('keyframe.available', kf)
        console.log('Keyframe available!');
    }
    if(chunkdata.chunkId > this.biggestChunkId) {
        var chunk = new Chunk(this, chunkdata.chunkId, chunkdata)
        this.biggestChunkId = chunkdata.chunkId
        this.chunks[chunkdata.chunkId] = chunk
        this.emit('chunk.available', chunk)
        console.log('Chunk available!');
        //this.startDownloadChunk('./download/');

        if(chunkdata.endGameChunkId === chunkdata.chunkId) {
            this.ended = true
            this.emit('end')
            console.log('End!');
            //this.startDownloadChunk('./download/');
        }
    }
    setTimeout(this.pollForChunk.bind(this), chunkdata.nextAvailableChunk)
})


Game.prototype.startDownloadChunk = co(function *(outputDirectory, sDCChunkID) {
    
    var result = yield this.getLastChunkInfo.bind(this)
    var chunkdata = result[0]
/*    fs.exists(outputDirectory + testGameID + '/chunks/' + chunkdata.chunkId, function (err, exists){
        if(err) {
            console.log(err);
        }
        chunkExists = exists;
    })*/
    if (!fs.existsSync(outputDirectory + sDCChunkID)) {
    this.downloadChunk(outputDirectory, sDCChunkID)
    console.log('downloadChunk', sDCChunkID, outputDirectory);//, chunk
    }
    
/*    if (chunkdata.status === undefined){
        chunkdata.status = [];
        console.log('Set chunkdata array');
        chunkdata.status[chunkdata.chunkId] = undefined;
        chunkStatus = [];
    }
    if(chunkdata.status){
        console.log('Set chunkdata array value only');
        chunkdata.status[chunkdata.chunkId] = undefined;
    }
    chunkStatus[chunkdata.chunkId] = chunkdata.status[chunkdata.chunkId];
    if(chunkStatus[chunkdata.chunkId] === undefined) {
        this.downloadChunk(outputDirectory, chunkdata.chunkId)
        console.log('downloadChunk', chunkdata.chunkId, outputDirectory);//, chunk)
    }*/
    if(chunkdata.endGameChunkId !== sDCChunkID) {
        setTimeout(this.startDownloadChunk.bind(this, outputDirectory, sDCChunkID), chunkdata.nextAvailableChunk)
    }
    
})

Game.prototype.startDownloadKeyframe = co(function *(outputDirectory, sDKKeframeID) {
    
    var result = yield this.getLastChunkInfo.bind(this)
    var chunkdata = result[0]
/*    fs.exists(outputDirectory + testGameID + '/chunks/' + chunkdata.chunkId, function (err, exists){
        if(err) {
            console.log(err);
        }
        chunkExists = exists;
    })*/
    if (!fs.existsSync(outputDirectory + sDKKeframeID)) {
    this.downloadKeyframe(outputDirectory, sDKKeframeID)
    console.log('downloadKeyframe', sDKKeframeID, outputDirectory);//, chunk
    }
    
/*    if (chunkdata.status === undefined){
        chunkdata.status = [];
        console.log('Set chunkdata array');
        chunkdata.status[chunkdata.chunkId] = undefined;
        chunkStatus = [];
    }
    if(chunkdata.status){
        console.log('Set chunkdata array value only');
        chunkdata.status[chunkdata.chunkId] = undefined;
    }
    chunkStatus[chunkdata.chunkId] = chunkdata.status[chunkdata.chunkId];
    if(chunkStatus[chunkdata.chunkId] === undefined) {
        this.downloadChunk(outputDirectory, chunkdata.chunkId)
        console.log('downloadChunk', chunkdata.chunkId, outputDirectory);//, chunk)
    }*/
    if(chunkdata.endGameChunkId !== chunkdata.chunkId) {
        setTimeout(this.startDownloadKeyframe.bind(this, outputDirectory, sDKKeframeID), chunkdata.nextAvailableChunk)
    }
    
})

Game.prototype.downloadKeyframe = co(function *(dir, id) {
    try {
        yield mkdirp.bind(null, dir)
    }
    catch (err) {
        return console.error(err)
    }
    var ws       = fs.createWriteStream(dir + id + '.txt')
    var decipher = crypto.createDecipheriv('bf-ecb', this.cryptoKey, "")
    var gunzip   = zlib.createGunzip()
    var url      = this.baseUrl + 'consumer/getKeyFrame/' + this.region + '/' + this.id + '/' + id + '/token'

    console.log('[', id, '] GET ', url)
    if (requestMade.testGameID.keyframes[id] === undefined) {
        requestMade.testGameID.keyframes[id] = 1;
        console.log(requestMade.testGameID.keyframes);
    var req = http.request(url, function(res) {
        console.log('[', id, ']', res.statusCode)
        if(res.statusCode !== 200) {
            console.log('ERR[', id, '] HTTP:', res.statusCode, res.headers)
            return;
        }
/*        fs.writeFile('chunk ' + id + '.txt', res, function(err) {
            if (err) throw err;
            console.log('Wrote chunk ' + id + ' to file!');
        })*/
        console.log("KEYFRAME RESPONSE LENGTH: " + res.length);
        //console.log("KEYFRAME RESPONSE DATA: " + res);
        res.pipe(decipher).pipe(gunzip).pipe(ws);
        gunzip.on('error', function(err) {
            console.log('ERR[', id, '] GZIP:', err)
        })
        ws.on('finish', function() {
            console.log('[', id, '] done')
            //this.chunkStatus[id].status = 'done'
            console.log('Finished keyframe decrypt and saved to directory: ' + dir + id);
            //chunkStatus[id] = 'done';
        }.bind(this))
    }.bind(this))
    req.on('error', function(err) {
            console.log('ERR[', id, '] HTTP:', err)
    })
    req.end();
    //var testWrite = fs.createWriteStream()
    }
})

Game.prototype.downloadChunk = co(function *(dir, id) {
    try {
        yield mkdirp.bind(null, dir)
    }
    catch (err) {
        return console.error(err)
    }
    var ws       = fs.createWriteStream(dir + id)
    var decipher = crypto.createDecipheriv('bf-ecb', this.cryptoKey, "")
    var gunzip   = zlib.createGunzip()
    var url      = this.baseUrl + 'consumer/getGameDataChunk/' + this.region + '/' + this.id + '/' + id + '/token'

    console.log('[', id, '] GET ', url)
    if (requestMade.testGameID.chunks[id] === undefined) {
        requestMade.testGameID.chunks[id] = 1;
        console.log(requestMade.testGameID.chunks);
    var req = http.request(url, function(res) {
        console.log('[', id, ']', res.statusCode)
        if(res.statusCode !== 200) {
            console.log('ERR[', id, '] HTTP:', res.statusCode, res.headers)
            return;
        }
        console.log("KEYFRAME RESPONSE LENGTH: " + res.length);
        //console.log("KEYFRAME RESPONSE DATA: " + res);

/*        fs.writeFile('chunk ' + id + '.txt', res, function(err) {
            if (err) throw err;
            console.log('Wrote chunk ' + id + ' to file!');
        })*/
        res.pipe(decipher).pipe(gunzip).pipe(ws);
        gunzip.on('error', function(err) {
            console.log('ERR[', id, '] GZIP:', err)
        })
        ws.on('finish', function() {
            console.log('[', id, '] done')
            //this.chunkStatus[id].status = 'done'
            console.log('Finished chunk decrypt and saved to directory: ' + dir + id);
            chunkStatus[id] = 'done';
        }.bind(this))
    }.bind(this))
    req.on('error', function(err) {
            console.log('ERR[', id, '] HTTP:', err)
    })
    req.end();
    //var testWrite = fs.createWriteStream()
    }
})

function decrypt(pass, data) {
    if(!Buffer.isBuffer(pass)) {
        pass  = new Buffer(pass.toString());
    }
    var decipher  = crypto.createDecipheriv('bf-ecb', pass, "")
    var inBuf = new Buffer(data, 'base64');
    decipher.write(inBuf);
    //decipher.end();
    return decipher.read();
}


