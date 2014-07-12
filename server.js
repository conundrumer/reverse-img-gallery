var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
var Scraper = require('./scraper.js')


app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({
	server: server
})
console.log("websocket server created")

var SEARCH_DELAY = 100;
var testimg = "http://static5.eurotriptips.com/wp-content/uploads/2012/10/1-IMG_2546.jpg"

// for each connection
wss.on("connection", function(ws) {
	console.log("websocket connection open")
	var timeoutID

	ws.on("close", function() {
		console.log("websocket connection close")
		clearTimeout(timeoutID)
	})

	ws.on('message', function(message) {
		console.log('received: %s', message)
		try {
			var input = JSON.parse(message)
			if (!input.img) return;

			// contains src images and other sizes of the same image
			var seen = Object.create(null)
			getSimilar(input, seen)

		} catch (e) {
			console.log(e);
			console.log('"%s" is not json', message)
		}
	})

	function getSimilar(input, seen) {
		Scraper.getSimilar(input, function(similar) {
			dups = dups || []
			for (var i = 0; i <= similar.length; i++) {
				if (i == similar.length) {
					onNoResults()
					return
				}
				var img = similar[i]
				if (seen[img]) continue
				input.img = img
				break
			}
			seen[input.img] = true
			dups.forEach(function(d) {
				seen[d] = true
			})
			timeoutID = setTimeout(function() {
				getSimilar(input, seen)
			}, SEARCH_DELAY)
			console.log("Scraped %s", input.img)
			ws.send(input.img)
		}, function (dups) {
			dups.forEach(function(d) {
				seen[d] = true
			})
		})


	}

	function onNoResults() {
		console.log("No more results")
		ws.send("No more results")
	}
})
