<template lang="pug"> 
transition(v-if="modalFlag" name="modal" appear)
  .modal__overlay(@click.self="closeModal")
    .modal__window.rounded.drop-shadow
      .modal__content
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
    display: flex
    align-items: center
    justify-content: center
    position: fixed
    z-index: 100
    top: 0
    left: 0
    height: 100%
    width: 100%
    background-color: rgba(0, 0, 0, 0.3)
  &__window
    height: 85%
    width: 70%
    max-width: 800px
    background-color: white
  &__content
    height: 100%
    padding: 30px 50px
    overflow-y: scroll

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