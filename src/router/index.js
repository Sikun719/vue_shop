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
	//主页  redirect重定向
	{
		path: '/Home',
		component: () => import('../views/Home'),
		redirect: "/Welcome",
		children: [
			{
				path: '/Welcome',
				component: () => import('../views/Welcome')
			},
			//用户管理-用户列表
			{
				path: '/users',
				component: () => import('../views/Users')
			},
			//权限管理-权限列表
			{
				path: '/rights',
				component: () => import('../views/Rights')
			},
			//权限管理-角色列表
			{
				path: '/roles',
				component: () => import('../views/Power')
			},
			//商品管理-商品分类
			{
				path: '/categories',
				component: () => import('../views/Cart')
			},
			// 商品管理-分类参数
			{
				path: '/params',
				component: () => import('../views/Params')
			},
			// 商品管理-商品列表
			{
				path: '/goods',
				component: () => import('../views/List')
			},
			// 商品管理-商品添加
			{
				path: '/add',
				component: () => import('../views/Add')
			},
			// 订单管理-订单列表
			{
				path: '/orders',
				component: () => import('../views/Order')
			},
			// 数据统计-数据报表
			{
				path: '/reports',
				component: () => import('../views/Report')
			},

		]
	},


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
