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

module.exports = {}
