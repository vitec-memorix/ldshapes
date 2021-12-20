import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ShapeCreateComponent from '@/components/shape/Create.vue'
import ShapePickSourceComponent from '@/components/shape/PickSource.vue'
import ConfigIndexComponent from '@/components/config/Index.vue'
import TransformerIndexComponent from '@/components/transformer/Index.vue'

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
  },
  {
    path: '/config/index',
    name: 'ConfigIndex',
    component: ConfigIndexComponent
  },
  {
    path: '/transformer/index',
    name: 'TransformerIndex',
    component: TransformerIndexComponent
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
