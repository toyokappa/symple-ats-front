<template lang="pug">
.with-empty-state
  template(v-if="attribute") {{ attribute }}
  .text-gray-400(v-else) 未入力
</template>

<script>
export default {
  props: {
    attribute: {
      type: [String, Number, null]
    }
  }
}
</script>