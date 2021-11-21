<template lang="pug"> 
.inline-block.text-xs.text-black.rounded.px-2(v-if="media" :class="`bg-${media.color}-100 py-0.5`") {{ media.name }}
</template>

<script>
// TODO: データ基盤ができたらいずれは削除
import { mediaList } from '@/fixtures'

export default {
  props: {
    mediaId: {
      type: [Number, null],
    }
  },
  data() {
    return {
      mediaList
    }
  },
  computed: {
    media() {
      return this.mediaList.find(media => media.id === this.mediaId)
    }
  }
}
</script>