// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vuex from 'vuex'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './utils/currency'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'

Vue.use(infiniteScroll)
Vue.use(vuex)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/img/error.jpg',
  loading: '/static/loading/loading-spinning-bubbles.svg',
  attempt: 1
})

Vue.config.productionTip = false
Vue.filter('currency', currency)

const store = new vuex.Store({
	state: {
		displayName: '',
		cartCount: 0
	},
	mutations: {
		updateCartCount (state, cartCount) {
			state.cartCount = cartCount
		},
		updateDisplayName (state, displayName) {
			state.displayName = displayName
		}
	}
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	store,
	router,
	components: {
		App
	},
	template: '<App/>'
})
