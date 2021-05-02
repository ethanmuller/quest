import Vue from 'vue'

Vue.directive('dpad', {
  bind(el, binding) {

    function dpadPress(e) {
      e.preventDefault();

      const rect = e.target.getBoundingClientRect()
      const elCenterPos = [rect.left + rect.width/2, rect.top + rect.height/2]
      let point;

      if (e.type === 'touchstart') {
        point = [e.touches[e.touches.length - 1].clientX, e.touches[e.touches.length - 1].clientY]
        // soundTuples['btnLo'][0].play();
      } else if (e.type === 'mousedown') {
        point = [e.clientX, e.clientY]
      }

      let p = [point[0] - elCenterPos[0], point[1] - elCenterPos[1]]

      const event = new CustomEvent('dpadPress', { bubbles: true })

      
      if (Math.abs(p[0]) > Math.abs(p[1])) {
        if (p[0] > 0) {
          el.classList.add('right')
          event.dir = [1, 0]
        } else {
          el.classList.add('left')
          event.dir = [-1, 0]
        }
      } else {
        if (p[1] > 0) {
          el.classList.add('down')
          event.dir = [0, 1]
        } else {
          el.classList.add('up')
          event.dir = [0, -1]
        }
      }
      
      el.dispatchEvent(event)
    }

    function dpadRelease() {
      el.classList.remove('active', 'up', 'down', 'left', 'right')
      const event = new CustomEvent('dpadRelease', { bubbles: true })
      el.dispatchEvent(event)
    }

    el.addEventListener('touchstart', dpadPress)
    el.addEventListener('mousedown', dpadPress)
    el.addEventListener('touchend', dpadRelease)
    el.addEventListener('mouseup', dpadRelease)
  },
})
