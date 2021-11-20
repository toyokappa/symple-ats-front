<template lang="pug"> 
.inline-block.text-xs.rounded.px-2(v-if="position" :class="`bg-${position.color}-100 py-0.5`") {{ position.name }}
</template>

<script>
export default {
  props: {
    position: {
      type: [Object, null],
    }
  }
}
</script>