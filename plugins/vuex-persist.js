import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      key: 'quest-vuex',
      storage: window.localStorage,
      reducer: state => ({ identity: state.identity })
    }).plugin(store);
  });
};
