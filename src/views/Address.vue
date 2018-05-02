<template>
	<div>
		
		<nav-header></nav-header>

		<nav-bread>
			<span>Cart</span>
			<!-- <span name="bread">测试插槽</span> -->
		</nav-bread>

		<div class="container">
		</div>

		<pop-modal v-bind:modalShow="modalShow" v-bind:formTitle="formTitle" v-on:close="closeModal">
			<div slot="formContent">
				<svg v-if="isStatusOK" class="icon-status-ok">
					<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
				</svg>
				<span>{{formMsg}}</span>
			</div>
			<div slot="formBtnGrop">
				<a href="javascript:;" v-if="ensureRemove" class="btn btn--m" @click="removeProd">确认</a>
				<a href="javascript:;" class="btn btn--m" @click="closeModal">关闭</a>
			</div>
		</pop-modal>

		<nav-footer></nav-footer>
	</div>
</template>

<script>
	import NavHeader from '@/components/NavHeader'
	import NavFooter from '@/components/NavFooter'
	import NavBread from '@/components/NavBread'
	import PopModal from '@/components/PopModal'
	export default {
		name: 'thisName',
		data () {
			return {
				// data: data
			}
		},
		components: {
			NavHeader,
			NavFooter,
			NavBread,
			PopModal
		},
		methods: {
			fun () {}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
