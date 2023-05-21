import { createRouter, createWebHistory } from 'vue-router'
import LoginPage  from '../components/LoginPage.vue'
import DashboardAdmin  from '../components/Dashboard/DashboardAdmin.vue'
import CurrenciesView  from '../components/Dashboard/CurrenciesView.vue'
import PairsView  from '../components/Dashboard/PairsView.vue'
import store from '../store';

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  
  {
    path: '/admin/dashboard',
    name: 'DashboardAdmin',
    component: DashboardAdmin,
    // Spécifie que la route a besoin d'une authentification
    meta: {requiresAuth: true},
    // Route enfant du dashboard
    children:[
      {
        path: 'pairs',
        // Lorsque le path sera atteint le composant correspondant sera rendu
        component: PairsView,
        // On exige aussi une authentification pour les routes en questions par mesure de sécurité
        meta: {requiresAuth: true},
      },
      {
        path: 'currencies',
        component: CurrenciesView,
        meta: {requiresAuth: true},
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Avant d'atteindre n'importe quelle route
router.beforeEach(async(to, from, next) => {
  
  // Si la prochaine route nécessite d'être authentifié et que le token est absent
  if (to.meta.requiresAuth && !store.state.user.token) {
    // Redirection à la page login pour s'authentifier
    console.log(store.state.user.token)
    next({ name: 'LoginPage' });
  } else {
    // Sinon le processus continue
    next();
  }
});



export default router
