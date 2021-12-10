<template lang="pug"> 
.inline-block.text-xs.text-black.rounded.px-2(v-if="medium" :class="`bg-${category.color}-100 py-0.5`") {{ medium.name }}
</template>

<script>
// TODO: データ基盤ができたらいずれは削除
import { categoryList } from '@/fixtures/mediaList'

export default {
  props: {
    medium: {
      type: [Object, null],
    }
  },
  data() {
    return {
      categoryList,
    }
  },
  computed: {
    category() {
      return this.categoryList.find(category => category.en === this.medium.category)
    }
  }
}
</script>