<template lang="pug"> 
.inline-block.text-xs.rounded.px-2(v-if="media" :class="`bg-${media.color}-100 py-0.5`") {{ media.name }}
</template>

<script>
export default {
  props: {
    media: {
      type: [Object, null],
    }
  }
}
</script>