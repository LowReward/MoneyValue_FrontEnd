import axios from "axios";
import store from '../store';

const axiosClient = axios.create({
  // Base de nos URL pour nos intécepteurs 
  baseURL: 'http://localhost:8000/api/'
})

// L'intercepteur utilise la méthode use() de notre objet en dessous
axiosClient.interceptors.request.use(config => {
  // Modificatation de l'en-tête d'autorisation avec le token stocké précedemment avec vuex
  // Notre backend attend celui ci pour les routes ayant le middleware de sanctum
  config.headers.Authorization = `Bearer ${store.state.user.token}`
  return config;
})

export default axiosClient;
