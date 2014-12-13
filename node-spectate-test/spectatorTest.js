var Observer = require('./lib/observer.js')
  , KeyframeParser = require('./lib/parser/keyframe.js')
  , co = require('co')
  , Game = require('./lib/game.js')
  , request = require('request')
  , moment  = require('moment')
  , http    = require('http')
  , zlib    = require('zlib')
  , crypto  = require('crypto')
  , mkdirp  = require('mkdirp')
  , fs      = require('fs')
  , helpers = require('./lib/helper.js')
  //, co      = require('usr/local/lib/node_modules/npm/node_modules/lol-observer-master/node_modules/co')
  , util    = require('util')
  , events  = require('events')
  , KeyFrame = require('./lib/keyframe.js')
  , Chunk    = require('./lib/chunk.js')

// function spectate(game) {
//     var first = true
//     game
//         .on('keyframe.available', function(data) {
//             console.log('new keyframe: ', data.id)
//             var buffers = []
//             var stream = data.download()
//             stream.on('data', function(bfr) {
//                 buffers.push(bfr)
//             })
//             stream.on('end', function() {
//                 var full = Buffer.concat(buffers)
//                 console.log('loaded keyframe ' + data.id + '#'+ game.id +' Bytes: ' + full.length)
//                 try {
//                     KeyframeParser().parse(full, dump);
//                 }
//                 catch(e) {
//                     console.log(e)
//                 }

//                 function dump(data) {
//                     console.log('time: ', data.time)
//                     console.log('%s players:', data.players.length)
//                     for(var pid in data.players) {
//                         console.log("player data: %s - %s", data.players[pid].start, data.players[pid].end)
//                         console.log("player[%s]: %s", data.players[pid].entity[0], data.players[pid].name)
//                         //console.log(data.players[pid].rubish)
//                         //console.log(data.players[pid].masteryPointsTotal)
//                         //console.log(data.players[pid].items)
//                     }
//                     /*console.log('%s towers:', data.towers.length)
//                     for(var tid in data.towers) {
//                         if(data.towers[tid].itemHeader[1]) {
//                             console.log(data.towers[tid].entity[0], data.towers[tid].name)
//                             console.log(data.towers[tid].unknown)
//                             console.log(data.towers[tid].itemHeader)
//                             console.log(data.towers[tid].items)
//                         }
//                     }*/
//                 }
//             })
//         })
//         .on('chunk.available', function(data) {
//             //console.log('new chunk: ', data.id)
//         })
//         .on('end', function(data) {
//             console.log('END')
//         })
//         .startSpectate()
//     console.log('spectating game: ' + game.id + ' ' + game.region)
// }

//Game.prototype.setObserverKey('nR2DR26/eLMcptq4ZyR4PdKo4BgREVGf');
testSpectate('1650898335', 't/vLxpsF6mEGe+1e87kSfOJOkNq5eFir');
function testSpectate(testGameIDInput, testObsKeyInput) {
	var testGameID = testGameIDInput;
	var testObsKey = testObsKeyInput;
    console.log(testGameIDInput);
    console.log(testObsKeyInput);
	var DECtestObsKey = decrypt(testGameIDInput, testObsKeyInput);
    console.log("Decrypted response: ");
    console.log(DECtestObsKey);
    //console.log(DECtestObsKey.toString('utf8'));
    return DECtestObsKey;

}

function decrypt(pass, data) {
    if(!Buffer.isBuffer(pass)) {
        console.log(pass);
        passNew  = new Buffer(pass.toString());
    }
    var decipher  = crypto.createDecipheriv('bf-ecb', passNew, "")
    var inBuf = new Buffer(data, 'base64');
    decipher.write(inBuf);
    //decipher.end();
    return decipher.read();
}

//var DLT = "4ca8 39af fdf6 c0e3 d16c 010d e3fb 677520a8 4615 eb47 3d57 fbd5 2a6e 2c61 2e63 e815 2555 38c5 2718 005a 01fa 46c0 1aa12fc0 81cc c16b 300b 5ea9 ee7b 7b8e e63f 6a97 b30e 3a7a caf3 8c01 c06a 5617 18042cf5 5c37 713d 5fc2 5a7c af72 6e68 dceb 5db9 c89d 1050 518d a9e0 7d37 e7ea 925aa985 f2c3 bb06 84b1 44b5 612d 20ba d7d8 8319 c9e6 35e5 894f b212 4407 a23d 6f03960e 4810 1631 94f7 578a 1bff 5ad3 1cfe 1cff c615 375a 4cc1 02d3 eda4 a831 20b4d176 c3ce 7346 c1da f6c4 f1ed 665b 42f1 2df1 0796 cd12 15d8 8933 8dfc 69d1 598e8278 5c4b 20d2 d17b 8182 adf1 3791 007b 6c19 a1c0 4ef8 5e37 b7c9 b9d9 fc45 c4914a26 5b8e 7937 3559 6028 8a9e e5f7 c83c 07a5 89a9 529e 854d 894b dde5 f80a a28c65ec 857a ef5d b10e 3245 dba5 9588 d522 9539 6266 1a2a 7c6f 0d50 5d7d c4f6 d549be98 f9f5 a4b7 ddfd 7fe4 74a9 4c14 fbac 616d 8979 2d88 95e2 ef95 a1d1 7ece 1a005930 3302 de0c 6c92 7748 667b 1dda bf29 9844 bec4 d293 8c39 f783 a6bc 9083 e623bdd1 a232 bc4e 2816 83b7 069b 2443 9a5e e013 89ad 3ab3 adb6 44e7 7270 0c82 e128bf01 e171 d454 ca77 5b7a 191e 124f fc72 0211 5b9a 5073 79cf 0369 2369 3f15 6e88ee7a a0d7 9ceb 60ec 2506 e678 9571 b93a 42e4 e0c5 37b4 d429 e9f3 e1d7 5cf8 c6306222 04e3 fae3 b162 df5f d565 c99d 67a1 f10d ee54 2043 eb8d 3d18 3b6d 3b1f 25e819e3 cd7a 9b24 035f b1fd aa5f ff3f db43 bde8 93e9 576d 1787 4d59 3dcc d96a 369406a5 683a c2c5 ee59 3e79 0e79 e62c a497 3d64 ebc8 1269 306c 7f9b ab05 ef8c 4c1093d1 8750 05d1 9551 5747 ac6e d046 dd2c eca7 8c04 4919 91f4 a750 838e ba3b 004d8326 5b40 38da 4882 9d75 17d4 196a 874d 744c ab34 d1c5 8826 06b6 fbf0 204f 30c6719c c7d0 5759 5215 9ab4 1f16 2842 0d7c 24f8 39ff d550 d78c 4c4e a043 0bd5 321cbd72 9dba b699 9287 f4f6 dd21 851a 8563 2a16 db2a f975 a022 8b06 d377 a7ce 16b88df0 e72f 498e e474 718d 74c5 68cf 0251 99ff e03b 0f92 a2dd b268 f4b2 5e1b 067b67f7 0b70 604b b215 75f4 95c1 1e8f 02a7 4998 03d1 837d b869 7c33 57ed d778 657c38e1 73b2 9e78 4f33 9bc4 482f 566f 25f8 9432 a554 0cd3 c6c2 b481 71b0 7a26 cc32a750 c6bd 6fbd e4e6 13af 49ff 3303 c745 176d 3408 2fbc 4ec7 a9e4 2894 351a e09a992b 6ee6 914b ce7b d350 213e 1ec0 6dd9 9cee 282c a517 347b c206 cc9f 888c f98bbeeb 8a41 33d2 551d 11d5 f070 f438 a939 5b96 3b34 e6a6 e906 6ced 21e1 f78a fb7ff0d3 2acd 1346 0531 4a1e 6c77 e676 6003 07c6 ac11 21e0 bbc9 c726 1a6c 3f98 a2f4524d e74e b3d5 9791 a89e c5ed 9730 64ba 2848 4cd8 4f09 2bb8 90b6 3ea1 2ec4 4d9731ed 3de0 823d 9c70 b1a4 1f1b eed3 a675 5f7c 14fe a3c5 6572 8ea4 426e a241 4feb23ee 1541 08ff 089a 62c1 b53f b3a3 090b adc6 76f6 4b45 6529 81a7 8184 30e7 07b4e348 a368 74e2 b459 0f12 9dba 8194 c72f 29d8 bd06 a6b0 2266 f3f4 84cf 1df8 ac904484 e317 54ac f6b6 3b6e 806b d79a 3d61 943a c5af a789 fc0a f909 6129 9b15 da97485d a6e2 facc e192 3e9a 01f0 26fa c92d 523b 8bd0 e90a 182c 652b cc82 907a 2440bae8 280e 5d38 521f 43e6 8f45 5ca7 69df b12a a467 eb74 23e0 2512 d91f ea6e 39c39414 d8bf b727 317a b86f 1a2e 334a eded a8c4 5a9c 8f63 181b 5d9d 65ed 6646 5106106f 60a0 406f e42d 7728 f1f6 d2e4 a17b a243 ede4 058d a705 c1cb c8dc d603 bd1d91af 2f5a 30fb 9781 a2c3 55b0 3555 993c a6f4 3238 db81 414e 267d a616 40e0 8b0b61f3 37fc 9ba3 043b 176f 2700 ce19 45b5 cd19 13a5 63c8 fb47 ac85 c045 0283 ec599a51 b2fa a5c7 b407 78f9 2489 0cfc 51f9 fb24 7459 08c4 f8b5 f07a 1227 b237 cadb4dea 0eeb d5e9 c14a 2993 c63c 8e0e 86e3 a67e 85e2 6238 5bc6 6c14 7c24 82b2 1af91767 ed83 2eeb a2b1 8cb2 8500 2267 a1d7 cfee 5b23 4b03 5a55 1813 782b 957e c4de6a87 0a19 1e6c 7ad1 2abe a139 fd20 6e73 ceb2 6ac4 ca8b 6eb5 da9d 6a91 4031 405bb9ae ee8a de1e c883 3d5f f264 4c06 d358 c72c 4013 ce14 971f 39b7 9556 e598 e8f5fe28 9c64 d359 0b86 1a9c 73f5 496d 4ad6 ac27 94e5 92cb ab93 49c0 7cea b8d6 4785ee21 0117 12e9 41e7 2cc1 85ff f2ea 0d37 2b52 9102 7673 bd09 658f 9d60 ead8 e6c3f70e 60af b075 2036 a4df b37a f35d 1a5d 5142 b3f0 28db 32ac 798d 5380 ffa0 a58dd2dd fc08 e23a 67b6 3950 2a46 3245 efc8 0c8d 3d19 a365 04c9 b0ba 5135 b717 93147501 1a3f 51f2 2bc6 78d3 1266 df0f c4e8 bfcf e9a4 0fc8 49c6 40d0 0956 d1a3 557e14d1 efa6 7a10 e52c f92b ead7 5fe6 81ff 10d7 0037 c529 3e94 1d42 10ae 6f4a b33418c4 d234 d7ab 18ee 6dcf 5a92 bf4a 7bfb 47ea df9c 696f f98c 57b7 3c96 28b1 dce2ae06 852d 1ccf 7aa5 87e1 957c cd56 763e df0f 0b7e c038 724d b941 fc1a 496f 4ae50892 b742 5043 0aaa 978e 469f 85a6 ea3c 60af 5e27 36ea d54f 3be2 7d6c db19 4595729b 961b 6d1f 193f 5603 7bf7 42a1 ef0c 37e9 70b5 63b4 815f fcec c5c4 d744 c28cbc33 973b 9962 f3f0 c9ed b975 b527 0702 85d0 bb69 d731 09c2 c2ba b4c0 0912 42d2b232 9f19 0a99 6b46 9e3d 377f b5c5 2722 5798 8895 bcc1 d571 ac0d d29e 7916 5aab1867 bd5c 28db 5806 71a9 929e 132b 91d0 3fe1 a6bb 4dd7 1df0 dee7 bbf7 325f 06d3ca67 df73 79c5 9099 98e1 27e9 3573 249e 6132 4cfc 8d45 c51f eba1 84f2 cf48 a8b30c21 4e1e 8b5e cfc3 1d2b 85d5 038b d12c d5e4 b659 2c30 1e15 f883 f948 0921 316fbb0f 0931 f821 a300 cdd7 a9e9 f062 c918 46fb 624f 8cb1 2d1a 0e0b b156 3b48 0ef52a65 c835 059e 8fd1 0408 e612 aac2 3ba5 d4e6 6078 c8f3 4785 72f1 3ebf 08c5 7971565e 0feb 7648 0be5 c5f1 1dd4 27d1 24e8 8a5b 8c29 e297 dd17 9e0f c72c ddc2 d202cf74 3895 d600 e92c 6baf 5bac 99a7 3c9b 2d97 7ee8 91ac 9123 d119 63dc c2fe 174c913d fd31 cda6 4dd4 98c1 80a3 2800 1ab5 2268 dfef 50ac 1aae 270c fd12 714a a37f1194 7017 e4b9 308f b9a1 1c06 8007 2e6f 4aed 0378 d9ce e902 93d3 4438 51da 999321a8 34d5 2a05 45b2 5f78 fa69 0486 5f3a 2ea5 8d59 48a6 847c 21a0 7b1b 545c 6d2725a6 2811 5927 7e88 8f2b 2269 d825 25e6 3133 c556 ef92 e6bc e924 c3f5 238d 3ea1b85a 6470 50d7 228e 3b54 51b5 86bc 89b0 4f93 a823 f496 95ee 01c8 5ecd 0782 2326bfa8 558d 504e 6722 e3c9 2dcf 9daa 86a1 0fdc fc87 45a0 05b1 dc67 5ac8 c745 ac7b3fa2 2a4f c164 55b5 480c 50b9 62c0 1963 ff8e 9d80 161a 0ea7 110f 0433 9917 a633f8e9 b0f5 39f3 6232 4ab7 5e1e 8a4a 64ab f5a6 7bac 5eee 747a e072 590c 82a6 f077c86f 653f 5bdb 2fd7 25ad b0b3 431b 9ec2 bce2 c1ec e03e 6b89 5f27 9780 1ef2 93abbe5c 9351 be62 18b1 4d82 3905 a7fb c858 f7cb 8feb 072e 5820 583a da52 56ff 019f5697 c617 765e e36a ef65 f30c 36a5 ffbf 32d2 7a88 4c8a 6e26 0a6e 499c 8838 77a69426 f933 5c1e f337 824f 13da d497 668a 8f0f eda4 21fd bd9c 1dd1 8c87 e666 41ef58d9 b651 f557 408e de39 4a3d eddf e8d9 0f66 c22a ba19 ddf5 3ea5 cdac 5581 0bc4bc1c bd5b 5802 58c7 f1c6 dd0f a45e 2bc6 89b5 cf2e 8573 9657 2a6a bcb8 cbcf b33b9f08 75e2 8687 6bbf b72f 7a4c 9d3c e2d7 5cc9 42ca 103c 9d04 989f c74e 3d23 13958db0 961a 02f5 0457 9c73 1251 20ce f4fd 9760 f99e f554 9f8b 44b5 bcb6 562d 1b26d06f 1c7b 71bb d44d 7d6e c4b6 c81a dd3b 1758 ae72 32e9 4f21 4ffc 3165 b077 b0fa6daa 0c4f e30e 5759 91a8 f0d9 e43d b295 7c39 e654 89d7 127a 8c3f d2f6 48cf ecf07063 2bdf 14ec 1d01 12bd da34 a377 9114 4711 246a c543 c572 6786 9344 c2ac 0ece56ac 8242 bb5b 380b 6f43 4194 1740 c0ca 6021 9736 33bb 1834 cefe 84a3 5639 391dbb96 5703 7e0b fcbe 7356 0296 8682 c689 33be f554 0506 e12d f226 b6e1 8681 a34415a8 3251 a0ce 9035 78b3 4821 889f a53d 05e8 e401 3246 15a5 696f ab70 c780 a8b95228 aa46 a37e 168e c467 a022 c7d0 e6a0 f776 7be0 0982 c38a c996 fc9c bcd8 5e1a260d aee3 0966 19fd 2a95 aa49 6d20 b37f f156 31a1 a0a0 e75d 4840 9131 3701 73ecfc23 4f77 fa44 e4f9 bdde 112c 55c8 ee08 9cc8 75f4 5c85 08bd 3a7e cf35 a62a 63864c32 bc04 f92c 8daa 27ad 62bd 095c a92b 83c7 9d7c f00b 5536 f1cc 9857 d55f cfd79de6 48d1 4734 b0df f1f8 8ac0 b84f c117 c345 00fd f68a c37b ca45 57d4 2ba6 122d1831 a5a6 2f7e 0150 89a3 40b3 7b0a 53d6 b0cb 951c 5135 75c6 c43e 8fd0 46a3 efcc963f cc6d 64b7 7442 92ba 6d84 e7a8 6b7b df78 46d1 5484 731a ba7f c6ea abb1 c2380e0b 24aa b60f b97b 68ae f942 cb67 23fb ce9e dabf 64ec 542b 0e57 0256 6e25 341a4243 b288 914e 3bce 37fb 56d0 91aa 0f88 29b3 35d7 0b45 3d65 70ff 0a92 8c6a cb8500df 8237 b532 5b99 0391 35bc 5add e0b8 67b1 6a9a a6d5 5ea6 86be b245 6fdf 6d40de98 bae0 242a 4f02 df7e e033 6db5 3475 b061 52b2 4e04 300c 8862 21f9 95de f859b2ec d996 2030 dc2d 9633 7bc1 cba3 ff54 c0b9 f5f1 b3d9 1d40 9dd0 3a2f 399d 23a72d6d d333 a98a 6b45 936a 4ac3 7905 4a47 96bf 4828 abf3 f8f7 0078 894e 39bd ed39876b c40e 01d6 c41c 4c95 ff94 a1e8 32e1 30e3 035d bd24 bfb8 333e 4bc5 ebd1 4921b327 cccc af0f 7074 3907 2d6b 5305 21fc 7be0 f683 9536 5a2a 69a0 707a 2666 c5bea9cb e2d2 5529 57ef 9605 2662 a45d 9971 750f 99da 828e bf23 95f9 1fbc d771 ab205b79 a2c2 6e9d 6516 e586 a6b9 6beb 6640 323b 76dc 8f3a 18a1 09cd a86c 84e6 555fe237 ab0f 73c5 0ace e1e2 6847 0bd7 8738 f9b5 1c73 874a fd6d 357b 0e6d 4609 451af9d7 ae87 b141 21d5 40aa b82d af57 aaf4 8e11 1be8 b9dd 39a7 8388 4d69 fa5e 6e76af46 497e 5c51 27e1 5f7d c825 ef0f 00ca 2966 252d 6d2c 5c8b 5fe2 7e8d fe3c 00d9c2ef 0b40 0c0a 5f67 6c8e 176e d29c 357a 5f93 e51d 92f6 940b c142 9582 0dc1 9961f5fd bcdc 9a63 a73d 0e10 beb5 556c 91b2 dde2 6c7d ad7f a143 eb7e 86d4 aa6c 13498b23 72ac 1f99 af90 435e 2471 a5b4 2289 f5e3 cbef 37e9 9e59 d678 3e08 1fe2 6a4875a3 bef9 f932 799d 84eb add7 3f71 faa3 78e7 5fe8 41ba fd53 dd4b 0a5b 9aa4 88100e8c 7779 a6ca e3f2 e900 6f62 d7ef 66b4 b35b 78d0 fcfc b0f5 0f20 3a65 1dd1 70ae 07b3 f8eb ac01 2180 c5a6 84e2 d312 e29c 7e4e 217f d343 ffee 4ebf 22a6 b5ef fb0f 6978 ef7a b35d a5b6 3fc1 19d8 1517 2bd0 c45b 8d4d f209 fc0a 52a1 9e1c 31bd 98ec 89cf c778 fbe2 2c03 f903 5865 1b70 8abb 006c 07c2 f1c7 4cb1 af88 b186 be08 b793 8f08 211c 54d4 634b 1819 050d d208 68af 1ead 61d1 45a9 d50c ac10 7e51 edc9 dab6 1e37 d368 5f3a 1bd2 1d6e e819 bc23 f1ad 3e3b a53e e652 4b3b bbc3 a24a 3ad7 6f66 c52b 4fcd 9496 8374 3de2 2111 7a06 58b5 57a4 6f7c c316 acfc 9fe2 e807 d84c 102c 9583 66e0 0b2e b7fe dc86 7344 dd5d aff1 4abf 983c eacb 2a72 75b3 e5b7 2c71 919b 17b2 f998 b599 3424 8de2 4892 84f8 9307 a008 e9c5 e32b 047d e0a2 cc2e 23de e0c6 e5c3 db65 0381 9bf0 ef95 4ec1 9a7a d5c9 b354 bc4a d595 e26a 25ac 173c 1b0b 1a1c 2bc6 4755 1111 02ce b9f7 0764 cad4 3101 ec91 949f 9bf5 51b5 e090 cd82 4d16 f85a c5fb 2925 c37c 334c 7643 ab9e 2eeb 7432 c7da 128d c69f caba b137 b32b 2b2c 859c 87b6 5af2 3f0d ae8a 2807 c460 2673 7df6 ccb8 39da 0fd9 b28c d270 38b6 b69a 44e7 0aee 1755 2a3b 2e0c eb27 5eb3 f558 9a85 b8f4 7bf6 23e3 eb03 dd6e a439 099d ff0e cd33 ddd5 9929 eda5 4def 119f 7464 69fd 2eb8 b689 dc16 0bf9 8d31 9b72 d880 af52 482c a4bf e1ef a283 841b dc33 96d7 d3e3 db1a 80a3 3331 35ec 7d78 b911 f4f0 d251 4547 fc46 6a8c c7e9 6625 47ea 05c6 dad9 3e86 6fdb 3fe5 6b62 4b11 6091 0e66 82e5 f1f3 e0d3 1ab9 d139 d1df 927a b94f ab74 5ba7 9d39 c89a d966 b335 20f7 c149 2d6a c609 a0e2 a930 a883 a236 0960 07d4 a18d dc57 85f3 43dc fb26 065d 260e 23c2 395a 146d 7c77 e9a4 3e04 2c7f ef28 9e51 10e9 7769 bc9f 0af9 6e7b bad6 3904 4d51 4b46 4a30 6032 2eca a702 b321 bd06 14a9 f0db d9cd b64c daa1 c6e2 cedc 2288 bb41 7815 fd6a 2ae3 716a b019 5552 8d70 6e7d d139 68c2 8411 f88f d485 2b7a 3395 2fba 14e1 1e07 89ba 15b4 986c bac3 d371 7277 59b3 e756 a4d3 fa6d f20a b4ff 6f7f e855 82c2 438e 8ae4 39f4 4d74 6e93 2544 714a 7044 851d 8b6f 0184 713e c8e1 291d 4b04 d1d4 3d4d abda 25e1 aaf6 d56d d3db bfe7 c085 fd4e e3e6 adf1 8e8e 11f3 a21f 538e 11f8 6fd5 f3a4 e7c6 02b3 96c4 b16c e2b2 d2a6 41c7 6feb c63f ca14 1e75 40df af82 6b0b 8a0b 1427 1829 0841 0033 7ff9 226f 04ef fd98 84a6 1eaf 6476 8bba 0128 f15c 472c 0d49 7a91 6a24 6765 0e00 931e a752 4ef0 5a90 5bb0 14c2 c483 eb05 d645 d9da 7232 78a2 273a 190b b069 1a6a adbe 99e0 ce2f 750c 9bb6 bad4 9afd 93e8 ccd2 2087 96d5 67fd 0783 a9df 3c54 6c72 2c9e 9fc8 2d37 a179 37dc af74 7734 8ce4 96ff 44b3 d141 99e7 996a ab8d 83c4 aa26 de0c 487f a0b9 e660 0e75 5bd5 258a 29af d2dc ec2c 25f3 7488 eef8 ab53 ee24 eeca 339b b23b 02a2 c0c6 8de9 89db 460f 6dbf 5d09 58c9 bd4e 0cd7 d432 3d95 6c6d 3139 3898 c517 fd08 99a1 dc79 45d1 1dfd 1fee 2f6c cfd0 e641 d3d0 5548 f476 98e3 ccd4 86aa f601 61e2 f400 97b0 0dd3 4a60 5925 801e 1891 ef7c";
newToken = DLT.replace(/ /g, '');
console.log("newToken = ")
console.log(newToken);
var testBuffer = testSpectate(DLT, newToken);
B64testBuffer = testBuffer.toString(16);
console.log(B64testBuffer);
