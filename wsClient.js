const WebSocket = require('ws')
require('dotenv').config()
const {spawn} = require('child_process')
const _isString = require('lodash/isString')
const _camelCase = require('lodash/camelCase')

const aliasThatNeedsDelayedRestart = ['codeRed', 'codeBlue']

const startWsClient = () => {
  const ws = new WebSocket('wss://aqueous-headland-89485.herokuapp.com/', [], {
    headers: {
      token: process.env.SHARED_KEY
    }
  })

  ws.on('open', function open() {
    console.log('Connected!')
  })

  ws.on('message', function incoming(text) {
    console.log('Message Received:', text)

    if (!_isString(text)) {
      return
    }

    const aliasName = _camelCase(text.trim())
    console.log('Invoke Command:', aliasName)

    const child = spawn(process.env.SHELL, `-i -c ${aliasName}`.split(' '), {
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore']
    })

    child.unref()

    if (aliasThatNeedsDelayedRestart.includes(aliasName)) {
      setTimeout(() => {
        console.log('Class: incoming, Function: , Line__39 {ws}(): '
        , {ws});
        ws.close()
        // startWsClient()
      }, 5000)
    }
  })

  ws.on('close', () => {
    startWsClient()
  })
}

startWsClient()
