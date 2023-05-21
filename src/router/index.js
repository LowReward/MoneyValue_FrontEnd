import { createRouter, createWebHistory } from 'vue-router'
import LoginPage  from '../components/LoginPage.vue'
import DashboardAdmin  from '../components/DashboardAdmin.vue'

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
    meta: {requeresAuth: true}
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
