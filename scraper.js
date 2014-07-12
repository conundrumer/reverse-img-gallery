var Spooky = require('spooky')

var spooky = new Spooky({
	child: {
		transport: 'http'
	},
	casper: {
		logLevel: 'debug',
		verbose: true
	}
}, function(err) {
	if (err) {
		e = new Error('Failed to initialize SpookyJS');
		e.details = err;
		throw e;
	}

	spooky.start(
		'http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost');
	spooky.then(function() {
		this.emit('hello', 'Hello, from ' + this.evaluate(function() {
			return document.title;
		}));
	});
	spooky.run();
});

spooky.on('error', function(e, stack) {
	console.error(e);

	if (stack) {
		console.log(stack);
	}
});

var gGreeting = 'Hello World';

spooky.on('hello', function (greeting) {
    console.log(greeting);
    gGreeting = greeting;
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});

var similar = [
	"http://lh3.ggpht.com/R6IVS2c1HIeWO8Wt-cRMromf25GAijihtSceCLVVTF_drLYZ8eyg05SWjqUvQef1I1DhYtTqAZhvZI0uE-kaJMSIbkMipbJb9tQ=s303",
	"http://thumbs.dreamstime.com/x/tropical-sunset-trees-silhouette-187982.jpg",
	"http://www.hotelpressarea.com/en/download/images/BBB_entrance.jpg",
	"http://dreamtours.pl/img/hotels/34527/bluebay_beach_resort_&_spa_18.jpg"
]
var dups = [
	"http://www.reiseservice-africa.de/1dk8ekm5/wp-content/uploads/2012/05/bluebaysultansuite-2000x976.jpg?size=bildergalerie"
]

var Scraper = {
	getSimilar: function(imgSeed, gotResults) {
		gotResults(similar)
	},
	getSimilarAndDups: function(imgSeed, gotResults) {
		gotResults(similar, dups)
	}
}

module.exports = Scraper
