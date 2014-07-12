var Spooky = require('spooky')

var SEARCH_URL = "https://www.google.com/searchbyimage?&image_url="
var pageSettings = {
	userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11"
}
var test_similar = [
	"http://lh3.ggpht.com/R6IVS2c1HIeWO8Wt-cRMromf25GAijihtSceCLVVTF_drLYZ8eyg05SWjqUvQef1I1DhYtTqAZhvZI0uE-kaJMSIbkMipbJb9tQ=s303",
	"http://thumbs.dreamstime.com/x/tropical-sunset-trees-silhouette-187982.jpg",
	"http://www.hotelpressarea.com/en/download/images/BBB_entrance.jpg",
	"http://dreamtours.pl/img/hotels/34527/bluebay_beach_resort_&_spa_18.jpg"
]
var test_dups = [
	"http://www.reiseservice-africa.de/1dk8ekm5/wp-content/uploads/2012/05/bluebaysultansuite-2000x976.jpg?size=bildergalerie"
]

var Scraper = {}
Scraper.getSimilar = function(input, gotResults, gotDups) {
	var imgseed = input.img
	var omitdups = input.omitdups || false
	var similarUrl, dupUrl, similar, dups

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

		spooky.start(SEARCH_URL + imgseed);
		spooky.then(function() {
			this.emit('hello', 'Hello, from ' + this.evaluate(function() {
				return document.title;
			}));
			// this.capture("test.png")
			var urls = this.evaluate(function() {
				return Array.prototype.map.call(document.querySelectorAll('a'), function(n) {
					return {
						text: n.textContent,
						href: n.href
					}
				});
			})
			similarUrl = urls.filter(function(url) {
				return url.text == "Visually similar images" && url.href.match("www.google.com")
			})[0]
			dupUrl = urls.filter(function(url) {
				return url.text == "All sizes" && url.href.match("www.google.com")
			})[0]
			// this.emit('hello', "similarUrl: " + JSON.stringify(similarUrl));
			// this.emit('hello', "dupUrl: " + JSON.stringify(dupUrl));

			this.open(similarUrl.href)
		});
		if (omitdups) {
			spooky.then(function() {
				// this.capture("similar.png")
				var similar = this.evaluate(function() {
					return Array.prototype.map.call(document.querySelectorAll('a.rg_l'), function(n) {
						return n.href.split("?")[1].split("&")[0].split("=")[1];
					})
				});
				this.emit('similar', similar)
				// this.emit('hello', similar[10] + ", length: " + similar.length)
			})
		} else {
			spooky.then(function() {
				// this.capture("similar.png")
				var similar = this.evaluate(function() {
					return Array.prototype.map.call(document.querySelectorAll('a.rg_l'), function(n) {
						return n.href.split("?")[1].split("&")[0].split("=")[1];
					})
				});
				this.emit('similar', similar)
				// this.emit('hello', similar[10] + ", length: " + similar.length)
				this.open(dupUrl.href)
			})
			spooky.then(function() {
				// this.capture("similar.png")
				var dups = this.evaluate(function() {
					return Array.prototype.map.call(document.querySelectorAll('a.rg_l'), function(n) {
						return n.href.split("?")[1].split("&")[0].split("=")[1];
					})
				});
				this.emit('dups', dups)
				// this.emit('hello', dups[0] + ", length: " + dups.length)
			})
		}
		// spooky.then(function() {
		// 	gotResults(similar, dups)
		// })
		// spooky.thenClick()
		spooky.run();
	});

	spooky.on('similar', function(s) {
		console.log("got similar: ", s[0]);
		gotResults(similar)
	})

	spooky.on('dups', function(d) {
		console.log("got dups: ", d[0]);
		gotDups(d)
	})
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
}

module.exports = Scraper
