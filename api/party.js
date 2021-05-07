const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
console.log('asdf')
// console.log(context)

const parties = []

function makeid(length) {
  const result           = [];
  const consonants       = 'BCDFGHJKLMNPRSTVYZ';
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

app.get('/', (req, res) => {
  res.json(parties)
})

app.post('/', (req, res) => {
  const party = {
    ticket: req.body.ticket,
    code: makeid(4)
  }

  parties.push(party)
  console.log(party.code)

  res.json(party)
})

module.exports = app
