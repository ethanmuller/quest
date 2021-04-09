const express = require('express')
const app = express()

app.get('/eggs', (req, res) => {
  res.json([
    'bird',
    'lizard',
    'human',
    'fish',
  ])
})

module.exports = {
  path: '/api',
  handler: app,
}
