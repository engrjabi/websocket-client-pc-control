var express = require('express')
var router = express.Router()
const _ = require('lodash')
const {spawn} = require('child_process')

let pageKite = spawn('python2', 'pagekite.py 3000 engrjabi.pagekite.me'.split(' '))

console.log('Class: , Function: , Line__8 {pageKite}(): '
, {pageKite});

/* GET home page. */
router.get('/', function (req, res, next) {
  let text = req.query.text

  if (_.isString(text)) {
    // Check for custom command before running alias
    const aliasName = _.camelCase(text.trim())
    console.log('Class: , Function: , Line__12 {aliasName}(): '
      , {aliasName})

    pageKite.kill()
    pageKite = spawn('python2', 'pagekite.py 3000 engrjabi.pagekite.me'.split(' '))

    const child = spawn(process.env.SHELL, `-i -c ${aliasName}`.split(' '), {
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore']
    })
    child.unref()
  }


  console.log('Class: , Function: , Line__7 (): ')
  console.log(require('util').inspect({
    text
  }, false, null, true /* enable colors */))

  res.send('Hello')
})

module.exports = router
