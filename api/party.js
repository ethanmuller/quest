const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const partyManager = require('../server/party-manager')
import { io } from '../server/multiplayer-manager'

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json(partyManager.partyList)
})

app.post('/', (req, res) => {
  const party = partyManager.addParty(req.body.ticket)
  res.json(party)
})

app.get('/:id', (req, res) => {
  const party = partyManager.getParty(req.params.id)

  if (!party) {
    return res.sendStatus(404);
  }

  res.json(party)
})

app.get('/:id/upload', (req, res) => {
  
  io.in(req.params.id).emit('test-event')
  res.send('ok')
})

module.exports = app
