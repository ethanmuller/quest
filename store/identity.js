export const state = () => ({
  nickname: '',
})

export const mutations = {
  setNickname(state, value) {
    state.nickname = value
  }
}
