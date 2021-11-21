<template lang="pug"> 
.inline-block.text-xs.text-black.rounded.px-2(v-if="position" :class="`bg-${position.color}-100 py-0.5`") {{ position.name }}
</template>

<script>
// TODO: データ基盤ができたらいずれは削除
import { positionList } from '@/fixtures'

export default {
  props: {
    positionId: {
      type: [Number, null],
    }
  },
  data() {
    return {
      positionList
    }
  },
  computed: {
    position() {
      return this.positionList.find(position => position.id === this.positionId)
    }
  }
}
</script>