const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
// console.log(context)

const parties = []

function makeId(length) {
  const result           = [];
  const consonants       = 'BCDFGHJLMPRSTVYZ';
  const vowels       = 'EOU';
  const charLists = [consonants, vowels]

  for ( let i = 0; i < length; i++ ) {
    let list

    if (i === 0 || i === length - 1) {
      list = consonants
    } else {
      list = vowels
    }

    let charactersLength = list.length;
    result.push(list.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}

function addParty(ticket) {
  const party = {
    ticket,
    id: makeId(4)
  }

  parties.push(party)

  return party
}

app.get('/', (req, res) => {
  res.json(parties)
})

app.post('/', (req, res) => {
  const party = addParty(req.body.ticket)
  res.json(party)
})

module.exports = app
