<template lang="pug"> 
.inline-block.text-xs.rounded.px-2(v-if="position" :class="`bg-${position.color}-100 py-0.5`") {{ position.name }}
</template>

<script>
export default {
  props: {
    positionId: {
      type: [Number, null],
    }
  },
  data() {
    const positionList = [
      {
        id: 1,
        name: 'エンジニア',
        color: 'blue',
      },
      {
        id: 2,
        name: 'デザイナー',
        color: 'yellow',
      },
      {
        id: 3,
        name: 'ポテ枠',
        color: 'gray',
      },
    ]
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