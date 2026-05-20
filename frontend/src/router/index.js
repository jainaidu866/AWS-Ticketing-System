import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Callback from '../views/Callback.vue'
import TicketList from '../views/TicketList.vue'
import CreateTicket from '../views/CreateTicket.vue'
import TicketDetail from '../views/TicketDetail.vue'
import { auth } from '../stores/auth.js'

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/login', component: Login },
  { path: '/callback', component: Callback },
  { path: '/tickets', component: TicketList, meta: { requiresAuth: true } },
  { path: '/tickets/new', component: CreateTicket, meta: { requiresAuth: true } },
  { path: '/tickets/:id', component: TicketDetail, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  auth.init()
  if (to.meta.requiresAuth && !auth.token) return '/login'
})

export default router