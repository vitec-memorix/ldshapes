import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ShapeCreateComponent from '@/components/shape/Create.vue'
import ShapePickSourceComponent from '@/components/shape/PickSource.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/shape/pick',
    name: 'ShapePickSource',
    component: ShapePickSourceComponent
  },
  {
    path: '/shape/create',
    name: 'ShapeCreate',
    component: ShapeCreateComponent
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
