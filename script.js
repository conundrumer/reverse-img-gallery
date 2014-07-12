var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host)
ws.onopen = function() {
    ws.send('hello server, from client')
    ws.send(JSON.stringify({
    	img:'http://something',
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
