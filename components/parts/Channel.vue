<template lang="pug"> 
.inline-block.text-xs.text-black.rounded.px-2(v-if="channel" :class="`bg-${category.color}-100 py-0.5`") {{ channel.name }}
</template>

<script>
// TODO: データ基盤ができたらいずれは削除
import { categoryList } from '@/fixtures/channelList'

export default {
  props: {
    channel: {
      type: [Object, null],
    },
  },
  data() {
    return {
      categoryList,
    }
  },
  computed: {
    category() {
      return this.categoryList.find(
        (category) => category.en === this.channel.category
      )
    },
  },
}
</script>
