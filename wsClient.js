require('dotenv').config()

const WebSocket = require('ws')
const {spawn} = require('child_process')
const _isString = require('lodash/isString')
const _camelCase = require('lodash/camelCase')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const kill = require('tree-kill')

const aliasThatNeedsDelayedRestart = ['codeRed', 'codeBlue']

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({processes: {}}).write()

const startWsClient = () => {
  let shouldReconnectOnClose = true

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

    if (text.includes('terminate')) {
      const aliasName = _camelCase(text.replace('terminate', '').trim())
      const existingProcess = db.get(`processes.${aliasName}`)
        .value()

      if (existingProcess && existingProcess.pid) {
        kill(existingProcess.pid)
        return
      }
    }

    const aliasName = _camelCase(text.trim())
    console.log('Invoke Command:', aliasName)

    const child = spawn(process.env.SHELL, `-i -c ${aliasName}`.split(' '), {
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore']
    })
    child.unref()

    db.set(`processes.${aliasName}`, child)
      .write()

    if (aliasThatNeedsDelayedRestart.includes(aliasName)) {
      shouldReconnectOnClose = false
      setTimeout(() => {
        ws.terminate()
        startWsClient()
      }, 10000)
    }
  })

  ws.on('close', () => {
    if (shouldReconnectOnClose) {
      startWsClient()
    }
  })
}

startWsClient()
