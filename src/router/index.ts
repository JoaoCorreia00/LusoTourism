import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Accommodations from '../pages/Accommodations.vue'
import AccommodationsDetails from '../pages/AccommodationsDetails.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/accommodations', name: 'Accommodations', component: Accommodations },
  { path: '/accommodationsdetails/:api/:id', name: 'AccommodationsDetails', component: AccommodationsDetails },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
