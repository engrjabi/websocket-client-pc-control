const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/');

ws.on('open', function open() {
  console.log('Connected!')
});

ws.on('message', function incoming(data) {
  console.log("Message Received:", data);
  // Do some processing here about the message sent
});
