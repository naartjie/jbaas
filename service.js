'use strict'

const Promise = require('bluebird')
const express = require('express')
const {exec} = require('child_process')
const {version} = require('./package.json')
const app = express()

app.route('/health')
  .get((req, res) => res.send('ok'))




app.use('/', (req, res) => {
  console.log(`${req.method} ${req.url}`)

  Promise.fromCallback(cb => exec('hostname', cb))
  // .delay(200)
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
