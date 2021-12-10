<template lang="pug"> 
.inline-block.text-xs.text-black.rounded.px-2(v-if="position" :class="`bg-gray-100 py-0.5`") {{ position.internalName }}
</template>

<script>

export default {
  props: {
    position: {
      type: [Object, null],
    }
  },
}
</script>