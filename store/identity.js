export const state = () => ({
  nickname: '',
  avatarUrl: '',
})

export const mutations = {
  setNickname(state, value) {
    state.nickname = value
  },
  setAvatarUrl(state, value) {
    state.avatarUrl = value
  }
}
