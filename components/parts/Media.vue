<template lang="pug"> 
.inline-block.text-xs.text-black.rounded.px-2(v-if="media" :class="`bg-${media.color}-100 py-0.5`") {{ media.name }}
</template>

<script>
export default {
  props: {
    mediaId: {
      type: [Number, String, null],
    }
  },
  data() {
    const mediaList = [
      {
        id: 1,
        name: 'Wantedly',
        color: 'green',
      },
      {
        id: 2,
        name: 'Green',
        color: 'green',
      },
      {
        id: 3,
        name: 'JAC',
        color: 'red',
      },
    ]
    return {
      mediaList
    }
  },
  computed: {
    media() {
      return this.mediaList.find(media => media.id == this.mediaId)
    }
  }
}
</script>