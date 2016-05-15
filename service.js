'use strict'

const Promise = require('bluebird')
const express = require('express')
const {exec} = require('child_process')
const quotes = require('./quotes')
const app = express()

app.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.route('/health').get((req, res) => res.send('ok'))

app.use('/', (req, res) => {
  getHostInfo()
  .delay(200)
  .then(host => {

    let quote = quotes[Math.floor(Math.random() * quotes.length)]
    let {trim} = req.query

    if (trim) quote = `${quote.slice(0, trim)}...`

    res.json({ host, quote })
  })
})

app.listen(3000, () => {
  console.log('service-1 started on port 3000')
})

function getHostInfo() {
  // const cmd = '/sbin/ifconfig eth0 | grep \'inet addr:\' | cut -d: -f2 | awk \'{ print $1}\''
  const cmd = 'hostname'
  return Promise.fromCallback(cb => exec(cmd, cb)).then(ip => ip.trim())
}
