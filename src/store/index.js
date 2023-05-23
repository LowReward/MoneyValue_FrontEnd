import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';


// Document VueX laissé mais toute la logique de VueX avec un state pour mon token de connexion a été retiré
// Malheureusement même en utilisant vuex persist, après chaque refresh mon token repassé à null
// Donc facilité le code et le rendre plus clair sans partir dans tous les sens, je place juste mon token dans le localstorage

export default createStore({
  state: {
    user: {
      data: {},
      token: null
    }
  },
  plugins: [createPersistedState()]
});
