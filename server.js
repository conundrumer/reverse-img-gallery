var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000
// var scraper = require('./scraper.js')

var testimgs = [
	"http://static5.eurotriptips.com/wp-content/uploads/2012/10/1-IMG_2546.jpg",
	"http://lh3.ggpht.com/R6IVS2c1HIeWO8Wt-cRMromf25GAijihtSceCLVVTF_drLYZ8eyg05SWjqUvQef1I1DhYtTqAZhvZI0uE-kaJMSIbkMipbJb9tQ=s303",
	"http://thumbs.dreamstime.com/x/tropical-sunset-trees-silhouette-187982.jpg",
	"http://www.hotelpressarea.com/en/download/images/BBB_entrance.jpg",
	"http://dreamtours.pl/img/hotels/34527/bluebay_beach_resort_&_spa_18.jpg"
]

// contains src images and other sizes of the same image
var seen = Object.create(null)

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({
	server: server
})
console.log("websocket server created")
var i = 0
wss.on("connection", function(ws) {
	var id = setInterval(function() {
		ws.send(testimgs[i], function() {})
		console.log(testimgs[i])
		i = (i+1) % testimgs.length
	}, 1000)

	console.log("websocket connection open")

	ws.on("close", function() {
		console.log("websocket connection close")
		clearInterval(id)
	})
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
})
