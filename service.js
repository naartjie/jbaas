'use strict'

const Promise = require('bluebird')
const express = require('express')
const {exec} = require('child_process')
const {version} = require('./package.json')
const quotes = require('./quotes')
const app = express()

app.use('/', (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.route('/health')
  .get((req, res) => res.send('ok'))

app.route('/quotes/random')
  .get((req, res) => {
    getIP()
    .delay(200)
    .then(ip => res.json({
      quote: quotes[Math.floor(Math.random() * quotes.length)],
      ip,
    }))
  })

app.use('/', (req, res) => {
  getIP()
  .delay(200)
  .then(ip => res.json({
    ip,
    version,
    what: 'service-1',
    when: new Date(),
  }))

})

app.listen(3000, () => {
  console.log('service-1 started on port 3000')
})

function getIP() {
  const cmd = '/sbin/ifconfig eth0 | grep \'inet addr:\' | cut -d: -f2 | awk \'{ print $1}\''
  return Promise.fromCallback(cb => exec(cmd, cb)).then(ip => ip.trim())
}
