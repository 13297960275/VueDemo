<template>
	<div class="nav-breadcrumb-wrap">
		<div class="container">
			<nav class="nav-breadcrumb">
				<a href="/">Home</a>
				<!-- <span>Goods</span> -->
				<slot></slot> <!-- 默认插槽 -->
				<!-- <slot name="bread"></slot> 带名字的插槽 -->
			</nav>
		</div>
	</div>
</template>

<script>
	// import inportComp from './inportComp'
	export default {
		name: 'NavBread',
		data () {
			return {
				// data: data
			}
		},
		components: {
			// inportComp
		},
		methods: {
			fun () {}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
