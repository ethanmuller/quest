const express = require('express')
const app = express()
// const server = http.createServer(app);
// const socketio = require('socket.io')(server)
// import VueSocketIO from 'vue-socket.io'

// const SocketInstance = socketio('http://localhost:3000')


app.get('/eggs', (req, res) => {
  res.json([
    'bird',
    'lizard',
    'human',
    'fish',
  ])
})

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

module.exports = {
  path: '/api',
  handler: app,
}
