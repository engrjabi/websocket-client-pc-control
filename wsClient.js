const WebSocket = require('ws')
require('dotenv').config()

const ws = new WebSocket('ws://localhost:3000/', [], {
  headers: {
    token: process.env.SHARED_KEY
  }
})

ws.on('open', function open() {
  console.log('Connected!')
})

ws.on('message', function incoming(data) {
  console.log('Message Received:', data)
  // Do some processing here about the message sent
})
