<template lang="pug"> 
div(v-if="date") {{ stringDate }}
</template>

<script>
export default {
  props: {
    date: {
      type: [Date, null]
    }
  },
  computed: {
    stringDate() {
      if (!this.date) return

      return this.$dateFns.format(this.date, "yyyy.MM.dd")
    }
  }
}
</script>