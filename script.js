var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host)

var testimg = "http://www.reiseservice-africa.de/1dk8ekm5/wp-content/uploads/2012/05/bluebaysultansuite-2000x976.jpg?size=bildergalerie"
ws.onopen = function() {
    ws.send('hello server, from client')
    ws.send(JSON.stringify({
    	img:testimg,
    	// you can't get the same img url twice,
    	// but you might get a very similar/duplicate img
    	omitdups: false
    }))
}
ws.onmessage = function(event) {
	var li = document.createElement('li')
	li.innerText = event.data
	document.querySelector('#pings').appendChild(li)
}
