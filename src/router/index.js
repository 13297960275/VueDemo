import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// @:占位符，src目录
import Cart from '@/views/Cart'
import Goods from './../views/Goods'
import Title from '@/views/Title'
import Image from '@/views/Image'
import SubTitle from '@/views/SubTitle'

Vue.use(Router)

export default new Router({
	mode: 'history', // history路由模式，去掉#
	// mode: 'hash', // has路由模式，須#

	// routes: [{
	// 	path: '/',
	// 	name: 'HelloWorld',
	// 	component: HelloWorld
	// }]

	// 动态路由
	// routes: [{
	// 	path: '/goods/:goodId/user/:userId',
	// 	name: 'Goods',
	// 	component: Goods
	// }]

	// 嵌套路由
	// routes: [{
	// 	path: '/goods',
	// 	name: 'Goods',
	// 	component: Goods,
	// 	children: [{
	// 		path: 'title',
	// 		name: 'title',
	// 		component: Title,
	// 		children: [{
	// 			path: 'subtitle',
	// 			name: 'subtitle',
	// 			component: SubTitle
	// 		}]
	// 	}, {
	// 		path: 'image',
	// 		name: 'image',
	// 		component: Image
	// 	}]
	// }]

	// 编程式路由
	/*通过js实现页面的跳转
	$router.push('name')
	$router.push({path:'name'})
	$router.push({
			path: 'name?a=123'
		}) 或者 $router.push({
				path: 'name,query:{a:123}})
	$router.go(1)*/

	routes: [{
		path: '/',
		name: 'HelloWorld',
		components: {
			default: HelloWorld,
			title: Title,
			img: Image
		}
	}, {
		path: '/cart/',
		name: 'cart',
		component: Cart
	}, {
		path: '/cart/:name',
		name: 'cart',
		component: Cart
	}, {
		path: '/goods',
		name: 'Goods',
		component: Goods,
		children: [{
			path: 'title',
			name: 'title',
			component: Title
		}, {
			path: 'image',
			name: 'image',
			component: Image
		}]
	}]
})