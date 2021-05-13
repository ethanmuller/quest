const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const partyManager = require('../lib/party-manager')

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json(partyManager.partyList)
})

app.get('/:id', (req, res) => {
  const party = partyManager.getParty(req.params.id)

  if (!party) {
    return res.sendStatus(404);
  }

  res.json(party)
})

app.post('/', (req, res) => {
  const party = partyManager.addParty(req.body.ticket)
  res.json(party)
})

module.exports = app
