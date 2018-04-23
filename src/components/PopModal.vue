<template>
	<div>
		<div v-bind:class="{'md-show' : modalShow}" class="md-modal modal-msg md-modal-transition">
			<div class="md-modal-inner">
				<div class="md-top">
					<div class="md-title">{{formTitle}}</div>
					<button class="md-close" @click="closeModal">Close</button>
				</div>
				<div class="md-content">
					<div class="confirm-tips">
						<slot name="formErrorMsg"></slot>
						<slot name="formContent"></slot>
					</div>
					<div class="btn-wrap">
						<slot name="formBtnGrop"></slot>
					</div>
				</div>
			</div>
		</div>

		<div class="md-overlay" v-if="modalShow" @click="closeModal"></div>
	</div>
</template>

<script>
	// import inportComp from './inportComp'
	export default {
		name: 'PopModal',
		props: ['modalShow', 'formTitle'],
		data() {
			return {
				// formTitle: '警告'
			}
		},
		components: {
			// inportComp
		},
		methods: {
			closeModal() {
				this.$emit('close')
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

