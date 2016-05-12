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
  .get((req, res) => Promise.fromCallback(cb => exec('hostname', cb))
    .delay(200)
    .then(hostname => {
      res.json({
        quote: quotes[Math.floor(Math.random() * quotes.length)],
        que: '121',
        what: 'service-1',
        when: new Date(),
        hostname,
        version,
      })
    })
  )

app.use('/', (req, res) => {
  Promise.fromCallback(cb => exec('hostname', cb))
  .delay(200)
  .then(hostname => hostname.trim())
  .then(hostname => res.json({
    hostname,
    version,
    what: 'service-1',
    when: new Date(),
  }))

})

app.listen(3000, () => {
  console.log('service-1 started on port 3000')
})
