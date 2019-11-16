var {Server} = require('ws')

const createWsServer = () => {
  const wss = new Server({noServer: true})

  wss.on('connection', (ws) => {
    console.log('Client connected')
    ws.on('close', () => console.log('Client disconnected'))
  })

  global.wss = wss
  return wss
}

module.exports = createWsServer
