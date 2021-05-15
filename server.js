const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Songs
const SKUPackages = require('./packages/sku-packages.json');
const SongDB = require('./data/db/songs.json');
const PJSONCarousel = require('./carousel/party-carousel.json');

// Avatars, Quests and Bosses.
const CustomDB = require('./data/db/items.json');
const Quest = require('./data/db/quests.json');
const QJSONCarousel = require('./carousel/pages/aa-quests.json');
const Bosses = require('./wdf/online-bosses.json');

// V1, V2 and V3
const v1 = require('./v1/configuration.json');
const v2 = require('./v2/entities.json');
const v3 = require('./v3/users/1b5f3c8c-4072-4d13-af9e-f47d7a6e8021.json');

// Others
const DM = require('./data/dm/blocks.json');
const SKUConstants = require('./constant-provider/v1/sku-constants.json');
const WDF = require('./wdf/assign-room.json');
const Ping = require('./data/ping.json');
const COM = require('./com-video/com-videos-fullscreen.json');
const Pages = require('./carousel/pages/upsell-videos.json');
const CarouselPackages = require('./carousel/packages.json');
const RoomPC = require('./wdf/rooms/PCJD2017/screens.json');
const Time = require('./wdf/server-time.json');
const Subs = require('./data/refresh.json');

app.get('/packages/v1/sku-packages', function(request, response) {
  response.send(SKUPackages)
})

app.get('/songdb/v1/songs', function(request, response) {
  response.send(SongDB)
})

app.get('/dance-machine/v1/blocks', function(request, response) {
  response.send(DM)
})

app.post('/carousel/v2/pages/quests', function(request, response) {
  response.send(QJSONCarousel)
})

app.post('/carousel/v2/pages/party', function(request, response) {
  response.send(PJSONCarousel)
})

app.post('/carousel/v2/pages/avatars', function(request, response) {
  response.send(Avatars)
})

app.post("/carousel/v2/pages/dancerprofile", (req, res) => {
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'prod-ws.just-dance.com',
    port: 443,
    path: '/carousel/v2/pages/dancerprofile',
    method: 'POST',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'Content-Type': 'application/json',
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, req.body, function(redResponse){
  	res.send(redResponse)
  })
})

app.post("/carousel/v2/pages/friend-dancerprofile", (req, res) => {
  var json = JSON.stringify(req.body)
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'prod-ws.just-dance.com',
    port: 443,
    path: '/carousel/v2/pages/friend-dancerprofile?pid=' + req.query.pid,
    method: 'POST',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'Content-Type': 'application/json',
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, json, function(redResponse){
  	res.send(redResponse)
  })
})

app.get('/questdb/v1/quests', function(request, response) {
  response.send(Quest)
})

app.get('/status/v1/ping', function(request, response) {
  response.send(Ping)
})

app.get('/customizable-itemdb/v1/items', function(request, response) {
  response.send(CustomDB)
})

app.get('/com-video/v1/com-videos-fullscreen', function(request, response) {
  response.send(COM)
})

app.get('/constant-provider/v1/sku-constants', (req, res) => {
  res.send(SKUConstants)      
})

app.post('/carousel/v2/pages/upsell-videos', function(request, response) {
  response.send(Pages)
})

app.post('/subscription/v1/refresh', function(request, response) {
  response.send(Subs)
})

app.get('/content-authorization/v1/maps/:map', function(request, response) {
  if(request.params.map){
    var path = "./map/"
    if(fs.existsSync(path + request.params.map + ".json")){
      fs.readFile(path + request.params.map + ".json", function(err, data){
        if(err) throw err;
        if(data){
          var strdata = JSON.parse(data),
              pardata = JSON.stringify(strdata);
          response.send(pardata)
        }
      })
    } else {
      response.send("Forbidden")
    }
  }
})

app.get("/profile/v2/profiles", (req, res) => {
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'prod-ws.just-dance.com',
    port: 443,
    path: '/profile/v2/profiles?profileIds=' + req.query.profileIds,
    method: 'GET',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Authorization': auth,
      'Content-Type': 'application/json',
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, '', function(redResponse){
  	res.send(redResponse)
  })
})

app.post("/profile/v2/profiles", function(req, res){
  res.redirect(307, "https://prod-ws.just-dance.com/profile/v2/profiles")
})

// v1
app.get('/v1/applications/341789d4-b41f-4f40-ac79-e2bc4c94ead4/configuration', function(request, response) {
  response.send(v1)
})

// v2
app.get('/v2/spaces/f1ae5b84-db7c-481e-9867-861cf1852dc8/entities', function(request, response) {
  response.send(v2)
})

// v3
app.get("/v3/users/:user", (req, res) => {
	var auth = req.header('Authorization');
	var sessionid = req.header('Ubi-SessionId');
	const httpsopts = {
	  hostname: 'public-ubiservices.ubi.com',
	  port: 443,
	  path: '/v3/users/' + req.params.user,
	  method: 'GET',
	  headers: {
	    'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
	    'Accept': '*/*',
	    'Authorization': auth,
	    'Content-Type': 'application/json',
	    'ubi-appbuildid': 'BUILDID_259645',
	    'Ubi-AppId': '341789d4-b41f-4f40-ac79-e2bc4c94ead4',
	    'Ubi-localeCode': 'en-us',
	    'Ubi-Populations': 'US_EMPTY_VALUE',
	    'Ubi-SessionId': sessionid
	  }
	}
	redirect(httpsopts, '', function(redResponse){
  		res.send(redResponse)
  	})	
})

app.get("/leaderboard/v1/coop_points/mine", (req, res) => {
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'prod-ws.just-dance.com',
    port: 443,
    path: '/leaderboard/v1/coop_points/mine',
    method: 'GET',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Authorization': auth,
      'Content-Type': 'application/json',
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, '', function(redResponse){
  	res.send(redResponse)
  })
})

// packages
app.post('/carousel/v2/packages', function(request, response) {
  response.send(CarouselPackages)
})

app.post("/v3/users/:user", (req, res) => {
	var auth = req.header('Authorization');
	var sessionid = req.header('Ubi-SessionId');
	const httpsopts = {
	  hostname: 'public-ubiservices.ubi.com',
	  port: 443,
	  path: '/v3/users/' + req.params.user,
	  method: 'GET',
	  headers: {
	    'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
	    'Accept': '*/*',
	    'Authorization': auth,
	    'Content-Type': 'application/json',
	    'ubi-appbuildid': 'BUILDID_259645',
	    'Ubi-AppId': '341789d4-b41f-4f40-ac79-e2bc4c94ead4',
	    'Ubi-localeCode': 'en-us',
	    'Ubi-Populations': 'US_EMPTY_VALUE',
	    'Ubi-SessionId': sessionid
	  }
	}
	redirect(httpsopts, '', function(redResponse){
  		res.send(redResponse)
  	})	
})
app.post("/wdf/v1/assign-room", (req, res) => {
  var json = JSON.stringify({
    "playGlobally": 1
  })
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'jmcs-prod.just-dance.com',
    port: 443,
    path: '/wdf/v1/assign-room',
    method: 'POST',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'Content-Type': 'application/json',
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, '', function(redResponse){
  	res.send(redResponse)
  })
})
app.get("/wdf/v1/rooms/PCJD2017/ccu", (req, res) => {
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'jmcs-prod.just-dance.com',
    port: 443,
    path: '/wdf/v1/rooms/PCJD2017/ccu',
    method: 'GET',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, '', function(redResponse){
  	res.send(redResponse)
  })
})
app.get("/wdf/v1/rooms/PCJD2017/newsfeed", (req, res) => {
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'jmcs-prod.just-dance.com',
    port: 443,
    path: '/wdf/v1/rooms/PCJD2017/newsfeed',
    method: 'GET',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, '', function(redResponse){
  	res.send(redResponse)
  })	
})
app.get("/wdf/v1/rooms/PCJD2017/notification", (req, res) => {
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'jmcs-prod.just-dance.com',
    port: 443,
    path: '/wdf/v1/rooms/PCJD2017/notification',
    method: 'GET',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, '', function(redResponse){
  	res.send(redResponse)
  })
})
app.post("/wdf/v1/rooms/PCJD2017/screens", (req, res) => {
  var auth = req.header('Authorization');
  var json = JSON.stringify(req.body);
  const httpsopts = {
    hostname: 'jmcs-prod.just-dance.com',
    port: 443,
    path: '/wdf/v1/rooms/PCJD2017/screens',
    method: 'POST',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, json, function(redResponse){
  	res.send(redResponse)
  })
})
app.get("/wdf/v1/online-bosses", (req, res) => {
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'jmcs-prod.just-dance.com',
    port: 443,
    path: '/wdf/v1/online-bosses',
    method: 'GET',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, '', function(redResponse){
  	res.send(redResponse)
  })
})
app.get("/wdf/v1/server-time", (req, res) => {
  var auth = req.header('Authorization');
  const httpsopts = {
    hostname: 'prod-ws.just-dance.com',
    port: 443,
    path: '/wdf/v1/server-time',
    method: 'GET',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Accept-Language': 'en-us,en',
      'Authorization': auth,
      'X-SkuId': 'jd2017-pc-ww'
    }
  }
  redirect(httpsopts, '', function(redResponse){
  	res.send(redResponse)
  })
})

// v3/profiles/sessions
app.post("/v3/profiles/sessions", (req, res) => {
  var json = JSON.stringify({})
  var auth = req.header('Authorization')
  const httpsopts = {
    hostname: 'public-ubiservices.ubi.com',
    port: 443,
    path: '/v3/profiles/sessions',
    method: 'POST',
    headers: {
      'User-Agent': 'UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static',
      'Accept': '*/*',
      'Authorization': auth,
      'Content-Type': 'application/json',
      'ubi-appbuildid': 'BUILDID_259645',
      'Ubi-AppId': '740a6dc8-7d7a-4fbe-be2c-aa5d8c65c5e8',
      'Ubi-localeCode': 'en-us',
      'Ubi-Populations': 'US_EMPTY_VALUE'
    }
  }
  redirect(httpsopts, json, function(redResponse){
    var responsepar = JSON.parse(redResponse)
  	res.send(responsepar)
  });
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Función para redireccionar a otros sitios
// Es necesario un options que contiene los detalles de ruta, la manera (GET, POST) y la dirección
function redirect(options, write, callback) {
  var Redirect = https.request(options, (response) => {
  	response.on('data', (data) => {
  		callback(data);
  	})
  })
  Redirect.on('error', (e) => {
  	console.log(e)
  })
  Redirect.write(write)
  Redirect.end()
}