'use strict'

// require('@google/cloud-trace').start({samplingRate: 500})
// require('@google/cloud-debug')

const Promise = require('bluebird')
const express = require('express')
const {exec} = require('child_process')
const quotes = require('./quotes')
const app = express()

let running = true
let host = ''

app.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.route('/health').get((req, res) => res.status(running ? 200 : 500).send(running ? 'ok' : 'not ok'))

app.use('/', (req, res) => {
  Promise.delay(20)
  .then(() => {
    let quote = quotes[Math.floor(Math.random() * quotes.length)]
    let {trim} = req.query

    if (trim) quote = `${quote.slice(0, trim)}...`

    res.json({ host, quote })
  })
})

process.on('SIGINT', shutdown)

getHostInfo()
.then(hostInfo => {
  host = hostInfo
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`jbaas service started on port ${port}`))
})

function shutdown() {
  running = false
  console.log('exiting...')
  setTimeout(() => {
    console.log('donesies...')
    process.exit()
  }, 10000)
}

function getHostInfo() {
  // const cmd = '/sbin/ifconfig eth0 | grep \'inet addr:\' | cut -d: -f2 | awk \'{ print $1}\''
  const cmd = 'hostname'
  return Promise.fromCallback(cb => exec(cmd, cb)).then(info => info.trim().slice(-5))
}
