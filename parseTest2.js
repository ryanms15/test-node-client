//var binaryString = require('binary-string');

//var Math = require('math');
/*
var bb = require('bit-buffer');*/

var fs = require('fs');

var bufferFile = new Buffer(0);
bufferFile = fs.readFileSync('./download/1656545715/chunks/16');

/*var bufferFile = new Buffer('b30013fe000f0102c729c745c5124f427fcbc545a40d0040');*/
console.log(bufferFile);
/*bufferFileReplaced = bufferFile.replace(/\r?\n/g, "");
bufferFileReplaced2 = bufferFile.replace(/\s+/g, '');*/

/*var bufferData = 'b300 98fe 000c 01e6 0c00 0000 0100 da070000 0103 00d4 0700 0002 0100 0000 00000300 0000 0000 0004 0000 0000 0000 0500000c 0d00 0006 0100 d107 0000 0701 00000000 0008 0000 0000 0000 0000 0000 0080bf00 0080 bf00 0080 bf00 0080 bf00 0080bf00 0080 bf00 0080 bf00 0080 bf00 0080bf00 0000 0000 0000 0000 0000 0000 00000000 0000 0000 0000 0000 0000 0000 00000000 0000 0000 0000 0000 0000 00';
bufferDataReplaced = bufferData.replace(/\r?\n/g, "<br />");

bufferDataReplaced2 = bufferDataReplaced.replace(/\s+/g, '');*/

/*var testBuffer = new Buffer (bufferFileReplaced2, 'hex');*/
/*var testBufferInt = new Buffer(0);
testBufferInt = fs.readFileSync('./download/1656545715/chunks/test2');
console.log(testBufferInt);
console.log(testBufferInt.readUInt8(0));*/
var sliceBuffer = bufferFile.slice(0, 4);
console.log('sliceBuffer: ' + sliceBuffer);
var binaryBuffer2 = sliceBuffer.toString('hex');
var binaryBufferPckg = binaryBuffer2;
/*bv = new bb.BitView(sliceBuffer);
bsw = new bb.BitStream(bv);
// Test initializing straight from the array.
bsr = new bb.BitStream(sliceBuffer);
binaryBufferPckg = bsr.readUint32(0);*/
console.log('bbpckg: ' + binaryBufferPckg);
console.log('bb2: ' + binaryBuffer2);
binaryBuffer = mathBase(binaryBuffer2, 2, 16);
binaryBufferTest = parseInt(binaryBuffer2, 10);
console.log('bbt: ' + binaryBufferTest);
binaryBufferTest = swap32(binaryBuffer2);
console.log('bbt: ' + binaryBufferTest);
binaryBufferTest = mathBase(binaryBufferTest, 10, 16);
console.log('bbt: ' + binaryBufferTest);
console.log(typeof binaryBuffer);
console.log(binaryBuffer);
console.log(binaryBuffer.length)
console.log(binaryBuffer[0]);
console.log(binaryBuffer[1]);
console.log('bbt: ' + binaryBufferTest);


if(binaryBuffer.length < 8) {
	var binaryBufferNew = binaryBuffer;
for (i = 0; i < 8 - binaryBuffer.length; i++) {
	binaryBufferNew = '0' + binaryBufferNew;
}
}

/*var bufferFile10 = new Buffer(0);
bufferFile10 = fs.readFileSync('./download/1656545715/chunks/16');*/
parseContent(parseData(bufferFile));

//parseData(bufferFile10);
//parseData(binaryBufferNew);

if(binaryBufferNew){
console.log(binaryBufferNew[0]);
console.log(binaryBufferNew[7]);
console.log(binaryBufferNew[6]);
console.log(binaryBufferNew.length);
}
/*binaryBuffer2 = '0x' + binaryBuffer2;
console.log(binaryBuffer2);
binaryBuffer2 =  parseInt(binaryBuffer2, 2);
console.log(binaryBuffer2);
var binaryBuffer = binaryString.fromBuffer(sliceBuffer);
console.log(binaryBuffer);*/

function addToEightBits(data) {
	if(data.length < 8) {
		var dataNew = data;
		for (i = 0; i < 8 - data.length; i++) {
			dataNew = '0' + dataNew;
		}
	return dataNew;
	}
	else {
		//console.log('addToEightBits error: data is 8 bits or longer already');
		return data;
	}
}

function mathBase(n, to, from) {
     return parseInt(n, from || 10).toString(to);
}

function parseData(data) {
	var bufferMarker;
	var HeaderSlice;
	var HeaderSliceBinary;
/*	bv = new bb.BitView(data);
	bsw = new bb.BitStream(bv);
	// Test initializing straight from the array.
	bsr = new bb.BitStream(data);*/
	var sliceData = {};
		sliceData.time = {};
		sliceData.time.lengthT = {};
		sliceData.time.value = {};
		sliceData.content = {};
		sliceData.content.paramLength = {};
		sliceData.content.contentLength = {};
		sliceData.content.lengthC = {};
		sliceData.content.lengthDecimal = {};
		sliceData.content.value = {};
		sliceData.content.param = {};
		sliceData.type = {};
		sliceData.type.exists = {};
		sliceData.type.value = {};
		sliceData.type.FETrue = {};
		sliceData.channel = {};

	var counter = 0;
	console.log("Data length: " + data.length);
	for(bufferMarker = 0; /*bufferMarker < data.length*/ counter < 50; counter++) {
		//console.log('NEW LOOP /////////////////////////////////////////');
		//console.log(counter);
		HeaderSlice = data.slice(bufferMarker, bufferMarker + 1);
		HeaderSlice = HeaderSlice.toString('hex');
		//console.log('HeaderSlice: ' + HeaderSlice);

		HeaderSliceBinary = mathBase(HeaderSlice, 2, 16);
		HeaderSliceBinary = addToEightBits(HeaderSliceBinary);
		//console.log('HeaderSliceBinary: ' + HeaderSliceBinary);

		sliceData.time.lengthT[counter] = parseTime(HeaderSliceBinary);
		//.log("time.length - " + counter + ": " + sliceData.time.length[counter]);

		sliceData.type.exists[counter] = parseType(HeaderSliceBinary);
		//console.log("type.exists " + sliceData.type.exists[counter]);

		sliceData.content.paramLength[counter] = parseBPLength(HeaderSliceBinary);
		//console.log("content.paramLength " + sliceData.content.paramLength[counter]);

		sliceData.content.contentLength[counter] = parseCL(HeaderSliceBinary);
		//console.log("content.contentLength " + sliceData.content.contentLength[counter]);

		sliceData.channel[counter] = parseChannel(HeaderSliceBinary);
		//console.log("channel " + sliceData.channel[counter]);

		bufferMarker++;
		//console.log("bufferMarker - 1: " + bufferMarker);

		sliceData.time.value[counter] = data.slice(bufferMarker, bufferMarker + sliceData.time.lengthT[counter]);
		//console.log("Time value - ");
		//console.log(sliceData.time.value[counter]);
		//sliceData.time.value[counter] = swap32(sliceData.time.value[counter]);
		if (sliceData.time.lengthT[counter] == 4) {
			sliceData.time.value[counter] = data.readFloatLE(bufferMarker);
			//console.log("Time value readInt32LE - seconds: ");
			//console.log(sliceData.time.value[counter]);
		}
		if (sliceData.time.lengthT[counter] == 1) {
			sliceData.time.value[counter] = data.readUInt8(bufferMarker);
			//console.log("Time value readInt32LE - millis since last block: ");
			//console.log(sliceData.time.value[counter]);
		}
		//console.log(sliceData.time.value[counter]);
		bufferMarker = bufferMarker + sliceData.time.lengthT[counter];
		//console.log(sliceData.time.length);
		//console.log("bufferMarker - 5: " + bufferMarker);
		
		//sliceData.content.length[counter] = data.slice(bufferMarker, bufferMarker + sliceData.content.contentLength[counter]);
		//console.log('LENGTH COUNTER: ');
		//console.log(sliceData.content.length[counter]);
		if (sliceData.content.contentLength[counter] == 4) {
			sliceData.content.lengthC[counter] = data.readInt32LE(bufferMarker);
			//console.log('readInt32LE: ');
			//console.log(sliceData.content.length[counter]);
		}
		if (sliceData.content.contentLength[counter] == 1) {
			sliceData.content.lengthC[counter] = data.readUInt8(bufferMarker);
			//console.log('readUint8: ');
			//console.log(sliceData.content.length[counter]);
		}
/*		console.log(sliceData.content.length[counter].toString('hex'));
		sliceData.content.length[counter] = sliceData.content.length[counter].toString('hex');
		sliceData.content.length[counter] = mathBase(sliceData.content.length[counter], 10, 16);
		console.log('LENGTH COUNTER: ' + sliceData.content.length[counter]);
		sliceData.content.length[counter] = swap32(sliceData.content.length[counter]);
		console.log('LENGTH COUNTER: ' + sliceData.content.length[counter]);
		sliceData.content.length[counter] = bsr.readUint8(bufferMarker);
		console.log('ACTUAL LENGTH COUNTER: ' + sliceData.content.length[counter]);*/
		bufferMarker = bufferMarker + sliceData.content.contentLength[counter];
		//console.log(sliceData.content.length[counter]);
		//console.log("bufferMarker - 9: " + bufferMarker);
		if(sliceData.type.exists[counter] == 1) {
			sliceData.type.value[counter] = data.slice(bufferMarker, bufferMarker + 1);
			bufferMarker++;
			//console.log("bufferMarker - 10: " + bufferMarker);
			if (sliceData.type.value[counter].toString('hex') == 'fe') {
				sliceData.type.FETrue[counter] = 1;
			}
		}
		if(sliceData.type.exists[counter] == 0) {
			sliceData.type.value[counter] = sliceData.type.value[counter-1];
		}
		sliceData.content.param[counter] = data.slice(bufferMarker, bufferMarker + sliceData.content.paramLength[counter]);
		bufferMarker = bufferMarker + sliceData.content.paramLength[counter];
		//console.log("bufferMarker - 14: " + bufferMarker);
		//sliceData.content.lengthDecimal[counter] = mathBase(sliceData.content.length[counter], 10, 16);
		//console.log("lengthDecimal SHOULD EQUAL 15: " + sliceData.content.lengthDecimal[counter]);
		sliceData.content.value[counter] = data.slice(bufferMarker, bufferMarker + sliceData.content.lengthC[counter]);
		//console.log("content.value SHOULD EQUAL 15: " + sliceData.content.value[counter]);
		//console.log("content.value: " + sliceData.content.value[counter]);
		bufferMarker = bufferMarker + sliceData.content.lengthC[counter];
		//console.log("bufferMarker - 29: " + bufferMarker);
		//console.log("counter: " + counter);
/*		console.log('ONE LOOP: sliceData:');
			//console.log(sliceData);
		console.log('TIME');
		console.log(sliceData.time);
		console.log('CONTENT');
		console.log(sliceData.content);
		console.log('TYPE');
		console.log(sliceData.type);
		console.log('CHANNEL');
		console.log(sliceData.channel);*/
	}
	console.log('FINISHED: sliceData: ' + sliceData);
	//console.log('TIME');
	//console.log(sliceData.time);
	//console.log('CONTENT');
	//console.log(sliceData.content);
	console.log('TYPE');
	console.log(sliceData.type);
	return sliceData;
	//console.log('CHANNEL');
	//console.log(sliceData.channel);
}

function parseTime(Header) {
	if(Header[0] == 0) {
		//console.log('Time ' + Header[0]);
		return 4;
	}
	if(Header[0] == 1) {
		//console.log('Time ' + Header[0]);
		return 1;
	}
	else {
		console.log('parseTime error: cannot find header value');
		return;
	}
}
function parseType(Header) {
	if(Header[1] == 0) {
		return 1;
		//return sliceData.type[i-1];
	}
	if(Header[1] == 1) {
		return 0;
	}
	else {
		console.log('parseType error: cannot find header value');
		return;
	}
}
function parseBPLength(Header) {
	if(Header[2] == 0) {
		return 4;
	}
	if(Header[2] == 1) {
		return 1;
	}
	else {
		console.log('parseBPLength error: cannot find header value');
		return;
	}
}
function parseCL(Header) {
	if(Header[3] == 0) {
		return 4;
	}
	if(Header[3] == 1) {
		return 1;
	}
	else {
		console.log('parseCL error: cannot find header value');
		return;
	}
}
function parseChannel(Header) {
	if(Header[5] == 1) {
		if(Header[6] == 1) {
			return 'loadscreen';
		}
		if(Header[6] == 0) {
			if(Header[7] == 1) {
				return 'communication';
			}
			if(Header[7] == 0) {
				return 'lowpriority';
			}
		}
	}
	if(Header[5] == 0) {
		if(Header[6] == 1) {
			if (Header[7] == 1) {
				return 's2c';
			}
			if (Header[7] == 0) {
				return 'gameplay';
			}
		}
		if(Header[6] == 0) {
			if(Header[7] == 1) {
				return 'c2s';
			}
			if(Header[7] == 0) {
				return 'handshake';
			}
		}
	}
	else {
		console.log('parseCL error: cannot find header value');
		return;
	}
}
function swap32(val) {
    return ((val & 0xFF) << 24)
           | ((val & 0xFF00) << 8)
           | ((val >> 8) & 0xFF00)
           | ((val >> 24) & 0xFF);
}
function swap16(val) {
    return ((val & 0xFF) << 8)
           | ((val >> 8) & 0xFF);
}

function parseContent(parsedData) {
	var PCArray = parsedData;
	console.log('parsedData.type = ');
	console.log(PCArray.type);
	console.log(Object.keys(PCArray.type.value).length);
	var PC = {};
		PC.typeHex = ['07','15','17','1a','22','2f','34','3f','40','42','5e','61','65','6e','6f','76','85','87','98','9f','ae','c4','dc','e0','e4','fe'];
		PC.typeDef = ['set ownership', 'set ability level','effect definiton','unknown type - 0x1a','gold reward','champion respawn','unknown type - 0x34','set level','attention ping','play emote','set death timer','movement group','damage done','unknown type - 0x6e','item purchase','unknown - 0x76','set cooldown','unknown type - 0x87','summoner disconnect','set item stacks','set health','attribute group','unknown type - 0xdc','set team','gold gain','extended type packet'];
		PC.typeLength = [4, 3, 0, -1, 12, 12, -1, 2, 21, 1, 18, 0, 13, -1, 8, -1, 9, -1, 5, 3, 10, 0, -1, 1, 8, 0];
		PC.typeSearch = {};
	for (x = 0; x < PC.typeHex.length; x++) {
		PC.typeSearch[PC.typeHex[x]] = {};
		PC.typeSearch[PC.typeHex[x]].searchIndex = {};
		PC.typeSearch[PC.typeHex[x]].def = {};
		PC.typeSearch[PC.typeHex[x]].tLength = {};
	} 
	for (PCCounter = 0; PCCounter < Object.keys(PCArray.type.value).length; PCCounter++) {
		var searchTerm = PCArray.type.value[PCCounter].toString('hex');
			index = -1;
		for(var i = 0, len = PC.typeHex.length; i < len; i++) {
  			  if (PC.typeHex[i] === searchTerm) {
       		  index = i;
       		  PC.typeSearch[PC.typeHex[i]].searchIndex[i] = PCCounter;
       		  console.log('Item ' + PCCounter + ' attributed to ' + PC.typeHex[i]);
      		  break;
 			   }
 			//console.log('Item ' + PCCounter + ' could not be attributed');
		}
		//console.log(search(PC.typeHex, PCArray.type.value[PCCounter].toString('hex')));
	}
	console.log(PC.typeSearch['65']);
}
function search(arr,obj) {
    return (arr.indexOf(obj) != -1);
}