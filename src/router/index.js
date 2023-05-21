import { createRouter, createWebHistory } from 'vue-router'
import LoginPage  from '../components/LoginPage.vue'
import DashboardAdmin  from '../components/DashboardAdmin.vue'
import store from '../store';

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/',
    name: 'DashboardAdmin',
    component: DashboardAdmin,
    // Besoin d'être authentifié
    meta: {requiresAuth: true}
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Avant d'atteindre n'importe quelle route
router.beforeEach((to,from,next) => {
  // Si la prochaine route nécessite d'être authentifié et que le token est absent
  if (to.meta.requiresAuth && !store.state.user.token){
    // Redirection à la page login pour s'authentifier
    next({name: 'Login'});
  } else{
    // Sinon le processus continue
    next();
  }
});


export default router
