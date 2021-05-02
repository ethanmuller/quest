<template>
    <article>
      <main>
        
      </main>
    <div id="controls">
      
      <div class="left">
        <button @dpadPress="dpadPress" @dpadRelease="dpadRelease" v-dpad id="dpad">
          <span class="y"></span>
          <span class="x"></span>
          <span class="circle"></span>
          <!-- <svg width="111" height="111" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg"> -->
            <!-- <path d="M55.5 0C51.634 0 48.5 3.134 48.5 7V35L55.5 41L62.5 35V7C62.5 3.134 59.366 0 55.5 0Z" fill="#C4C4C4"/> -->
            <!-- <path d="M111 55.5C111 51.634 107.866 48.5 104 48.5H76L70 55.5L76 62.5H104C107.866 62.5 111 59.366 111 55.5Z" fill="#C4C4C4"/> -->
            <!-- <path d="M0 55.5C0 59.366 3.13403 62.5 7 62.5H35L41 55.5L35 48.5H7C3.13403 48.5 0 51.634 0 55.5Z" fill="#C4C4C4"/> -->
            <!-- <path d="M62.5 104C62.5 107.866 59.366 111 55.5 111C51.634 111 48.5 107.866 48.5 104V76L55.5 70L62.5 76V104Z" fill="#C4C4C4"/> -->
            <!-- </svg> -->

        </button>
      </div>
      <div class="right buttons" id="r">
      </div>
      
    </div>
    </article>
</template>

<style>

:root {
  --bg: #e6e6e6;
  --fg: #000;
  --text: black;
  --cta: #ff0000;
}
img {
  width: 45rem;
}
img:first-child {
  /* position: absolute; */
}
audio {
  position: absolute;
  bottom: 0;
  left: 0;
}

* {
  box-sizing: border-box;
}

body {
  background: var(--bg);
  /* overflow: hidden; */
  flex-direction: column;
  justify-content: flex-start;


  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  max-width: 666px;
  margin: 0 auto;
}
article {
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: column;
}
section {
  min-height: 50vh;
  background: white;
  align-self: stretch;
  padding: 1rem 1rem 12rem;
}
pre {
  font-size: 0.8rem;
}

@keyframes load-bob {
  from {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: translate3d(0, 5px, 0);
  }
}

#p5_loading {
  font-size: 1rem;
  color: white;
  background: black;
  padding: 1rem;
  animation: load-bob 0.2s ease-out infinite;
  bottom: 50%;
  /* top: 50%; */
  /* right: 4rem; */
}

.tag {
  top: 0;
}

#controls {
  /* position: absolute; */
  /* transform: rotate(-90deg); */
  /* right: 0.5rem; */
  /* top: 50%; */
  display: flex;
  padding: 0 0.5rem;
  align-items: center;
  justify-content: space-between;
  width: 100%
}

#r {
  /* padding-right: 10vmin */
}

#r button {
  width: 5rem;
  height: 5rem;
}

#controls button {
  color: #333;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.320, 1.275);

  border-radius: 99rem;
}

#controls .buttons button {
}

.soft-shadow,
#play {
  box-shadow: 6px 6px 14px 0 rgba(0, 0, 0, 0.2),
              -8px -8px 18px 0 rgba(255, 255, 255, 0.55),
              inset 6px 6px 10px 0 rgba(0, 0, 0, 0),
              inset -6px -6px 10px 0 rgba(255, 255, 255, 0);
}

#play:active,
#play.down {
  /* transform: scale(0.98); */
  box-shadow: 6px 6px 14px 0 rgba(0, 0, 0, 0),
    -8px -8px 18px 0 rgba(255, 255, 255, 0),
  inset 6px 6px 10px 0 rgba(0, 0, 0, 0.2),
  inset -6px -6px 10px 0 rgba(255, 255, 255, 0.0);
  border-color: #c7d2c7;
}

#rate {
  display: flex;
  margin: 0 0.5rem;

  position: relative;

  padding-bottom: 1rem;


  display: none;
}

#rate::before,
#rate::after,
#rate button:first-of-type::before {
  position: absolute;
  bottom: -1em;
  font-size: 0.7rem;
  transform: rotate(-90deg);
  transform-origin: 0 50%;
  letter-spacing: 0.5em;
  color: var(--fg);
}

#rate::before {
  left: 0;
  content: "-666%";
}

#rate::after {
  left: 100%;
  content: "+666%";
}

#rate button:first-of-type::before {
  bottom: 0;
  left: 50%;
  bottom: 1em;
  content: "0%"
}

#rateMeter {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: calc(100% - 1rem);
  height: 0.5rem;
  margin-bottom: -0.25rem;
  transform: translateX(-50%);
  -moz-appearance: none;

  background: var(--nk);
}
#rateMeter::-moz-meter-bar {
  background: var(--bg);
  box-shadow: inset 0 0 0 2px var(--nk);
}

.throb {
  /* animation: load-bob 2s ease-out infinite alternate-reverse; */
  /* background: green !important; */
  /* color: white !important; */
}
#play {
}

#dpad {
  --length: 9rem;
  --thicc: 40px;
  --grace: 1rem;

  border: none;

  width: var(--length);
  height: var(--length);

  position: relative;

  transition: none !important;

  padding: 5rem;
}

#dpad.up {
  transform: translate3d(0, -2px, 0);
}

#dpad.down {
  transform: translate3d(0, 2px, 0);
}

#dpad.left {
  transform: translate3d(-2px, 0, 0);
}

#dpad.right {
  transform: translate3d(2px, 0, 0);
}

button#dpad {
  background: transparent;
}

#dpad .y {
  pointer-events: none;
  display: block;
  background: #777;
  width: var(--thicc);
  position: absolute;
  top: var(--grace);
  bottom: var(--grace);
  left: 50%;
  transform: translateX(-50%);
  border-radius: 1rem;
}

#dpad .x {
  pointer-events: none;
  display: block;
  background: #777;
  height: var(--thicc);
  position: absolute;
  top: 50%;
  left: var(--grace);
  right: var(--grace);
  transform: translateY(-50%);
  border-radius: 1rem;
}

.circle {
  display: none;
  background: black;
  position: absolute;
  width: 60px;
  height: 60px;

  opacity: 0;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0) scale(0.6) rotate(45deg);

  border-radius: 99rem;

  transition: all 0.05s ease-out;
  transform-origin: center;
}
#dpad.active .circle {
  opacity: 1;
}
#dpad.up .circle {
  transform: translate3d(-50%, calc(-50% - 71px), 0);
}
#dpad.down .circle {
  transform: translate3d(-50%, calc(-50% + 71px), 0);
}
#dpad.left .circle {
  transform: translate3d(calc(-50% - 71px), -50%, 0);
}
#dpad.right .circle {
  transform: translate3d(calc(-50% + 71px), -50%, 0) scale(1);
}

#dpad svg {
  pointer-events: none;
}

#rate button:first-of-type {
}

#play {
  margin-left: auto !important;
  color: white;

  padding: 1rem 1.2rem;
  margin: 0 0.5rem;
  /* margin: 0 0.5rem; */

  border: none;
  border-radius: 0.75rem;

  color: white;
  background: var(--fg);
  /* box-shadow: 0px 100px 80px rgba(0, 0, 0, 0.07), 0px 41.7776px 33.4221px rgba(0, 0, 0, 0.0503198), 0px 22.3363px 17.869px rgba(0, 0, 0, 0.0417275), 0px 12.5216px 10.0172px rgba(0, 0, 0, 0.035), 0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725), 0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802); */
  /* border-radius: 20px; */
  border: 2px solid #fbf4f40d;

  font-size: 1.2rem;
  letter-spacing: 0.25em;

	transition: transform 0.1s cubic-bezier(0.34, 3, 0.64, 1);

  background: #97b071;
  border: 10px solid #ddd;
  margin-right: 2rem;
}    

canvas {
  max-width: 100%;
  height: auto !important;
  width: 100vmin !important;
  height: 100vmin !important;
  /* cursor: pointer; */
  background: #ff5c5c;
  /* box-shadow: inset 5px 5px rgba(0, 0, 0, 0.1); */
}

@media (min-width: 666px) {
  canvas {
    width: 666px !important;
    height: 666px !important;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
img {

  /* animation: spin 120s linear infinite; */
}
audio {
  position: absolute;
  bottom: 0;
  left: 0;
}
h1, h2 {
  font-size: inherit;
  font-weight: normal;
  margin: 0;
  text-transform: uppercase;
  display: inline;
  /* letter-spacing: 0.2em; */
}

section a {
  display: inline-block;
  padding: 1rem;
  padding-left: 0;
}

.plus {
  display: block;
  text-align: center;
  padding: 1rem;
}

.tag {
  /* width: 3.5rem; */
}

.credits {
  display: inline-block;
}
</style>

<script>
import socket from '~/plugins/socket.io.js'

export default {
  data () {
    return {
      x: 0,
      y: 0,
      pos: [0, 0]
    }
  },
  head: {
    title: 'Nuxt.js with Socket.io'
  },
  watch: {
  },
  beforeMount () {
  },
  mounted() {   
    let sketch = function (p5) {    
      const canvasSize = 666;
      const numTilesW = 8;
      const numTilesH = 8;
      const tileWidth = canvasSize / numTilesW;
      const tileHeight = canvasSize / numTilesH;
      
      p5.setup = _ => {      
        p5.createCanvas(canvasSize, canvasSize);      
        p5.ellipse(p5.width / 2, p5.height / 2, 500, 500);    
      }
      p5.draw = _ => {      
        p5.background(0);
        // p5.push();
        // p5.translate(0, p5.height / 2);
        // p5.ellipse(posX, y, 50, 50);
        // p5.pop();
        // posX += this.speed;

        // wrap
        if (this.x > numTilesW) {
          this.x = 0;
        }
        if (this.x < 0) {
          this.x = numTilesW;
        }
        if (this.y > numTilesH) {
          this.y = 0;
        }
        if (this.y < 0) {
          this.y = numTilesH;
        }
        
        // if (posX > p5.width || posX < 0) {    
        //   this.speed *= -1;      
        // }

        p5.ellipse(this.x * tileWidth, this.y * tileHeight, tileWidth, tileHeight);
      }  
    }
    sketch = sketch.bind(this)
    // NOTE: Use p5 as an instance mode
    const P5 = require('p5');
    new P5(sketch);
  },
  methods: {
    dpadPress(e) {
      this.move(e.dir)
    },

    move(dir) {
      this.x = this.x + dir[0]
      this.y = this.y + dir[1]
    },

    dpadRelease(e) {
    }
  }
}
</script>
