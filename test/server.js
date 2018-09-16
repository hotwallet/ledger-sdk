const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')

const port = 8000

const options = {
  key: fs.readFileSync(`${__dirname}/ssl/key.pem`),
  cert: fs.readFileSync(`${__dirname}/ssl/cert.pem`)
}

const app = express()

const server = https.createServer(options, app).listen(port)

app.use(express.static(`${__dirname}/../`))

console.log(`https://localhost:${port}`)
