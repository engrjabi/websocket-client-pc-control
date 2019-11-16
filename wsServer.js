var {Server} = require('ws')

const createWsServer = (server) => {
  const wss = new Server({server})

  wss.on('connection', (ws) => {
    console.log('Client connected')
    ws.on('close', () => console.log('Client disconnected'))
  })

  global.wss = wss
  return wss
}

module.exports = createWsServer
