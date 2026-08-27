import { createRouter, createWebHistory } from 'vue-router'
import WeatherHome from '@/views/WeatherHome.vue'
import { findCityById } from '@/data/cities'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: WeatherHome,
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('@/views/WeatherAbout.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('@/views/WeatherDetail.vue'),
      props: true,
    },
    {
      path: '/not-found',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'NotFound' },
    },
  ],
})

// 등록되지 않은 cityId로 상세 화면에 접근하면 404 화면으로 보냅니다.
router.beforeEach((to) => {
  if (to.name === 'WeatherDetail') {
    const cityId = String(to.params.cityId)
    if (!findCityById(cityId)) {
      return { name: 'NotFound' }
    }
  }
})

export default router
