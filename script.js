var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host)
ws.onopen = function() {
    ws.send('hello server, from client');
}
ws.onmessage = function(event) {
	var li = document.createElement('li')
	li.innerText = event.data
	document.querySelector('#pings').appendChild(li)
}
