var Spooky = require('spooky')

var SEARCH_URL = "https://www.google.com/searchbyimage?&image_url="
var pageSettings = {
	userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11"
}

var similar = [
	"http://lh3.ggpht.com/R6IVS2c1HIeWO8Wt-cRMromf25GAijihtSceCLVVTF_drLYZ8eyg05SWjqUvQef1I1DhYtTqAZhvZI0uE-kaJMSIbkMipbJb9tQ=s303",
	"http://thumbs.dreamstime.com/x/tropical-sunset-trees-silhouette-187982.jpg",
	"http://www.hotelpressarea.com/en/download/images/BBB_entrance.jpg",
	"http://dreamtours.pl/img/hotels/34527/bluebay_beach_resort_&_spa_18.jpg"
]
var dups = [
	"http://www.reiseservice-africa.de/1dk8ekm5/wp-content/uploads/2012/05/bluebaysultansuite-2000x976.jpg?size=bildergalerie"
]

var Scraper = {}
Scraper.getSimilar = function(input, gotResults) {
	var imgseed = input.img
	var omitdups = input.omitdups

	var spooky = new Spooky({
		child: {
			transport: 'http'
		},
		casper: {
			pageSettings: pageSettings
		}
	}, function(err) {
		if (err) {
			e = new Error('Failed to initialize SpookyJS');
			e.details = err;
			throw e;
		}

		spooky.start(SEARCH_URL + similar[0]);
		spooky.then(function() {
			this.emit('hello', 'Hello, from ' + this.evaluate(function() {
				return document.title;
			}));
			// this.capture("test.png")
			var urls = this.evaluate(function() {
				return Array.prototype.map.call(document.querySelectorAll('a'), function(n) {
					return {text: n.textContent, href: n.href}
				});
			})
			var similarUrl = urls.filter(function(url){
				return url.text == "Visually similar images" && url.href.match("www.google.com")
			})[0]
			var dupUrl = urls.filter(function(url){
				return url.text == "All sizes" && url.href.match("www.google.com")
			})[0]
			this.emit('hello', "similarUrl: " + JSON.stringify(similarUrl));
			this.emit('hello', "dupUrl: " + JSON.stringify(dupUrl));
		});
		// spooky.thenClick()
		spooky.run();
	});

	spooky.on('error', function(e, stack) {
		console.error(e);

		if (stack) {
			console.log(stack);
		}
	});

	spooky.on('hello', function(greeting) {
		console.log(greeting);
	});

	spooky.on('log', function(log) {
		if (log.space === 'remote') {
			console.log(log.message.replace(/ \- .*/, ''));
		}
	});

	spooky.on('run.complete', function() {
		console.log("FINISH");
		spooky.destroy();
	})

	gotResults(similar, dups)
}

module.exports = Scraper
