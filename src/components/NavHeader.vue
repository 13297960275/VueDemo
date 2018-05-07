<template>
	<div>
		<header class="header">
			<svg-coll></svg-coll>

			<div class="navbar">
				<div class="navbar-left-container">
					<a href="/"><img class="navbar-brand-logo" src="static/img/logo.png"></a>
				</div>
				<div class="navbar-right-container" style="display: flex;">
					<div class="navbar-menu-container">
						<!--<a href="/" class="navbar-link">我的账户</a>-->
						<span v-if="loginName" class="navbar-link">欢迎&nbsp;|&nbsp;{{loginName}}</span>
						<a href="javascript:void(0)" v-if="!loginName" class="navbar-link" @click="showLogin(1)">Sign In</a>
						<a href="javascript:void(0)" v-if="!loginName" class="navbar-link" @click="showLogin(0)">Sign Up</a>
						<a href="javascript:void(0)" v-if="loginName" class="navbar-link" @click="signOut">Sign Out</a>
						<div class="navbar-cart-container">
							<span class="navbar-cart-count"></span>
							<a class="navbar-link navbar-cart-link" href="/#/cart">
								<svg class="navbar-cart-logo">
									<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>

			<div v-bind:class="{'md-show' : loginFlag}" class="md-modal modal-msg md-modal-transition">
				<div class="md-modal-inner">
					<div class="md-top">
						<div class="md-title">{{formTitle}}</div>
						<button class="md-close" @click="closeLoginPop">Close</button>
					</div>
					<form class="md-content">
						<div class="confirm-tips">
							<div class="error-wrap">
								<span v-show="errorFlag" class="error error-show">{{formErrorMsg}}</span>
							</div>
							<ul>
								<li class="regi_form_input">
									<i class="icon IconPeople"></i>
									<input type="text" v-model="userName" placeholder="User Name" class="regi_login_input" tabindex="1" name="loginname">
								</li>
								<li class="regi_form_input noMargin">
									<i class="icon IconPwd"></i>
									<input type="password" v-model="userPwd" placeholder="User Password" class="regi_login_input" tabindex="2" name="loginpwd">
								</li>
							</ul>
						</div>
						<div class="login-wrap">
							<a href="javascript:;" @click="loginOrRegister" class="btn-login">{{formBtn}}</a>
						</div>
					</form>
				</div>
			</div>

			<div class="md-overlay" v-if="loginFlag" @click="closeLoginPop"></div>
		</header>
	</div>
</template>

<script>
	import axios from 'axios'
	import SvgColl from './SvgColl'
	export default {
		name: 'NavHeader',
		data () {
			return {
				userName: '', // 登录名
				userPwd: '', // 密码
				loginFlag: false, // 是否显示登录框
				errorFlag: false, // 是否显示登录错误信息
				formErrorMsg: '', // 登录错误信息
				isLogin: true, // 登录or注册
				formTitle: '登录', // 标题文字
				formBtn: '登录', // 按钮文字
				loginName: '' // 已登录登录名
			}
		},
		components: {
			SvgColl
		},
		mounted () {
			this.checkLogin()
		},
		methods: {
			checkLogin () {
				axios.get('/users/checklogin').then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						this.loginName = res.result
					} else {
						this.loginName = ''
					}
				}).catch((err) => {
					console.log(err)
					this.errorFlag = true
					this.formErrorMsg = '服务器错误，请稍后重试'
				})
			},
			closeLoginPop () {
				this.loginFlag = false
			},
			showLogin (num) {
				this.errorFlag = false
				if (num === 1) {
					this.isLogin = true
					this.formTitle = '登录'
					this.formBtn = '登录'
				} else {
					this.isLogin = false
					this.formTitle = '注册'
					this.formBtn = '注册'
				}
				this.loginFlag = true
			},
			loginOrRegister () {
				if (!this.userName || !this.userPwd) {
					this.errorFlag = true
					this.formErrorMsg = '请输入用户名和密码'
					return
				}
				let url = ''
				if (this.isLogin) {
					url = '/users/signin'
				} else {
					url = '/users/signup'
				}
				axios.post(url, {
					userName: this.userName,
					userPwd: this.userPwd
				}).then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						this.loginFlag = false
						this.loginName = this.userName
					} else {
						this.errorFlag = true
						this.formErrorMsg = res.msg
					}
				}).catch((err) => {
					console.log(err)
					this.errorFlag = true
					this.formErrorMsg = '服务器错误，请稍后重试'
				})
			},
			signOut () {
				axios.get('/users/signout').then((resp) => {
					let res = resp.data
					if (res.status === 1) {
						this.loginFlag = false
						this.loginName = ''
					} else {

					}
				}).catch((err) => {
					console.log(err)
					this.errorFlag = true
					this.formErrorMsg = '服务器错误，请稍后重试'
				})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
