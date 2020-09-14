import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
	//根路径
	{
		path: '/',
		redirect: '/Login',
	},
	//登录
	{
		path: '/Login',
		name: '/Login',
		component: () => import('../views/Login')
	},
	//主页
	{
		path: '/Home',
		name: '/Home',
		component: () => import('../views/Home')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

//如果sessionStorage没有token不允许跳转home页面
//挂载路由守卫
router.beforeEach((to, from, next) => {
	//to将要访问的路径
	//from代表从那个路径来的
	//next是一个函数,表示放行
	//next()放行 next('/Login') 强制跳转
	if (to.path === '/Login') return next()
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) return next('/Login')
	next()
})
export default router
