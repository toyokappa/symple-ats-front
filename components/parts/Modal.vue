<template lang="pug"> 
transition(v-if="modalFlag" name="modal" appear)
  .modal__overlay.d-flex.items-center.justify-center.h-100.w-100(@click.self="closeModal")
    .modal__window.overflow-hidden.bg-white.rounded.drop-shadow
      .modal__content.h-100.p-10
        slot
</template>

<script>
export default {
  data() {
    return {
      modalFlag: false
    }
  },
  methods: {
    openModal() {
      this.modalFlag = true
    },
    closeModal() {
      this.modalFlag = false
    }
  }
}
</script>

<style lang="sass" scoped>
.modal
  &__overlay
    position: fixed
    z-index: 100
    top: 0
    left: 0
    background-color: rgba(0, 0, 0, 0.3)
  &__window
    height: 85%
    width: 70%
    max-width: 800px
  &__content

.modal-enter-active, .modal-leave-active
  transition: opacity 0.4s
  .modal__window
    transition: opacity 0.4s, transform 0.4s
.modal-leave-active
  transition: opacity 0.6s ease 0.4s
.modal-enter, .modal-leave-to
  opacity: 0
  .modal__window
    opacity: 0
    transform: translateY(-20px)
</style>