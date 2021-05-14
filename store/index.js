export const state = () => ({
  counter: 0,
})

export const getters = {
  // when you gotta know if the counter is at three or not
  isCounterThree: state => state.counter === 3
}

export const mutations = {
  increment(state) {
    state.counter++
  }
}
