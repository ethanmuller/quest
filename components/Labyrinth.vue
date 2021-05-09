<template>
  <article>
    <main>
    </main>
    <div id="controls">
      <Dpad @dpadRelease="dpadRelease" @dpadPress="dpadPress"></Dpad>
    </div>
    <div v-if="dead" class="game-over-screen">
      <div>
        YOU HAVE BEEN<br>EATEN BY THE BEAST
      </div>
      <button @click="respawn" :style="{ marginTop: '3rem', fontSize: '1.2rem', padding: '1.2rem', background: '#333', color: 'white', border: 'none', borderRadius: '99em' }">Respawn</button>
    </div>
  </article>
</template>

<style>
#controls {
  display: flex;
  padding: 0 0.5rem;
  align-items: center;
  justify-content: center;
  width: 100%
}

.game-over canvas,
.game-over #controls {
  display: none;
}

.game-over {
  background: black;
  color: white;
}

.game-over-screen {
  width: 20em;
  font-size: 1.2rem;
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>

<script>
import useSound from 'vue-use-sound'
import scare from '../static/scare.wav'
import world from '../maps/world.js'

const canvasSize = 666;
const numTilesW = 8;
const numTilesH = 8;
const tileWidth = canvasSize / numTilesW;
const tileHeight = canvasSize / numTilesH;

const things = {
  '#': {
    name: 'wall',
    solid: true,
  },
  
  '@': {
    name: 'spawn-point',
    solid: false,
  },
  
}

let spawnPoint;

for (let y = 0; y < world.length; y++) {
  for (let x = 0; x < world[0].length; x++) {
    if(thingAtLocation(x, y).name === 'spawn-point') {
      spawnPoint = { x, y }
    }
  }
}

function thingAtLocation(x, y) {
  const thing = world[y][x]
  return things[thing] || {}
}

export default {
  props: ['party'],
  
  asyncData () {
    return new Promise(function (resolve) {
      return socket.emit('join', { type: 'normie' }, function (data) {
        return resolve({ world: data })
      })
    })
  },
  data () {
    return {
      message: '',
      dead: false,
      x: spawnPoint.x,
      y: spawnPoint.y,
      isClenched: false,
      world: [
        // [3, 3],
        // [3, 4],
      ],
    }
  },
  head: {
    title: 'QUEST/LABYRINTH',
    link: [{ rel: 'icon', type: 'image/x-icon', href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 90'><text y='0.9em' x='-0.125em' font-size='80'>⚪</text></svg>" }],
  },
  watch: {
  },
  beforeMount () {
    // socket.emit('join', { type: 'normie' }, function (data) {
    //   this.world = data
    // })

    socket.on('world-update', (world) => {
      this.world = world
    })
    socket.emit('send-move', [this.x, this.y])
  },
  setup() {
    const [deathSound] = useSound(scare)
    
    return {
      deathSound,
    }
  },
  mounted() {   

    let sketch = function (p5) {    
      p5.setup = _ => {      
        p5.createCanvas(canvasSize, canvasSize);      
        p5.ellipse(p5.width / 2, p5.height / 2, 500, 500);    
      }
      p5.draw = _ => {      
        p5.background(0);
        // p5.push();
        // p5.translate(-this.x * tileWidth + p5.width/2, -this.y * tileWidth + p5.height/2);
        p5.translate((this.x - this.x % 9) * tileWidth * -1, (this.y - this.y % 9) * tileWidth * -1);
        // p5.ellipse(posX, y, 50, 50);
        // p5.pop();
        // posX += this.speed;
        
        // if (posX > p5.width || posX < 0) {    
        //   this.speed *= -1;      
        // }
        
        
        // draw static world
        p5.fill("#666")
        p5.rectMode(p5.RADIUS)
        for (let y = 0; y < world.length; y++) {
          for (let x = 0; x < world[0].length; x++) {
            if(thingAtLocation(x, y).name === 'wall') {
              p5.rect(x * tileWidth, y * tileHeight, tileWidth/2 + 1, tileHeight/2 + 1)
            }
          }
        }
        
        // draw other players
        for (let i = 0; i < this.world.length; i++) {
          if (socket.id === this.world[i].id) {
            continue;
          }
          
          if (this.world[i].type === 'beast') {
            if (this.world[i].isClenched) {
              p5.noStroke()
              p5.fill("#3B9B19")
              p5.ellipse(this.world[i].location[0] * tileWidth, this.world[i].location[1] * tileHeight,  tileWidth * 0.8);
            } else {
              p5.noFill()
              p5.stroke("#3B9B19")
              p5.strokeWeight(tileWidth*0.2)
              p5.ellipse(this.world[i].location[0] * tileWidth, this.world[i].location[1] * tileHeight,  tileWidth);
            }
          } else if (this.world[i].type === 'normie') {
            p5.noStroke()
            p5.fill("white")
            p5.ellipse(this.world[i].location[0] * tileWidth, this.world[i].location[1] * tileHeight,  tileWidth * (this.world[i].isClenched ? 0.9 : 1));
          }
          
          if (this.x === this.world[i].location[0] &&
              this.y === this.world[i].location[1] && this.world[i].isClenched) {
            this.kill()
          }
        }
        
        // draw players
        p5.noStroke()
        p5.fill("white")
        p5.ellipse(this.x * tileWidth, this.y * tileHeight, tileWidth * (this.isClenched ? 0.9 : 1));
      }  
    }
    sketch = sketch.bind(this)
    // NOTE: Use p5 as an instance mode
    const P5 = require('p5');
    new P5(sketch);
  },
  methods: {
    btnPress() {
      this.clenchStart()
    },
    
    btnRelease() {
      this.clenchEnd()
    },
    
    clenchStart() {
      this.isClenched = true
      socket.emit('send-clench', this.isClenched)
    },
    
    clenchEnd() {
      this.isClenched = false
      socket.emit('send-clench', this.isClenched)
    },
    
    dpadPress(dir) {
      this.move(dir)
    },
    
    dpadRelease() {
    },
    
    isEmpty(x, y) {
      return true
      return (x !== 1 || y !== 1)
    },
    
    kill() {
      this.dead = true
      document.body.classList.add('game-over')
      const loc = { x: -999, y: -999 }
      this.moveAbsolute(loc)
      socket.emit('send-move', [loc.x, loc.y])
      this.deathSound()
      // setTimeout(() => {
      //   // alert('you have been eaten by the beast.\nRIP in peace.')
      //   location.reload()
      // }, 3000)
    },

    respawn() {
      location.reload()
    },
    
    move(dir) {
      let targetX = this.x + dir[0]
      let targetY = this.y + dir[1]
      
      // wrap
      if (targetX > world[0].length - 1) {
        targetX = 0;
      }
      if (targetX < 0) {
        targetX = world[0].length - 1;
      }
      if (targetY > world.length - 1) {
        targetY = 0;
      }
      if (targetY < 0) {
        targetY = world.length - 1;
      }
      
      if (thingAtLocation(targetX, targetY).solid) {
        return false
      }
      
      this.x = targetX
      this.y = targetY
      
      socket.emit('send-move', [this.x, this.y])
    },
    
    moveAbsolute(location) {
      this.x = location.x
      this.y = location.y
    },
    
    sendMessage () {
      const message = {
        date: new Date().toJSON(),
        text: 'dpad pressed'
      }
      this.messages.push(message)
      this.message = ''
      socket.emit('send-message', message)
    },
  }
}
</script>

