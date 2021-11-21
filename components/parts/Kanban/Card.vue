<template lang="pug"> 
draggable(
  :list="cardList"
  group="kanban"
  @start="drag = true"
  @end="drag = false"
  @change="updateColumnId"
  ghostClass="ghost"
  :animation="200"
  :disabled="false",
  :emptyInsertThreshold="100"
  item-key="id"
)
  .bg-white.rounded.border.border-gray-200.shadow-sm.p-3.mb-2.cursor-pointer(v-for="card in cardList" :key="card.id" @click="openModal(card)")
    .text-sm(v-if="card.name") {{ card.name }}
    .text-sm.text-gray-300(v-else) 名前未入力
    parts-recruiter.mt-1(:recruiterId="card.recruiterId")
    .mt-1(v-if="card.mediaId")
      parts-media(:mediaId="card.mediaId")
    .mt-1(v-if="card.positionId")
      parts-position(:positionId="card.positionId")
    parts-started-date.text-xs.mt-2(:date="card.startedDate")
</template>

<script>
export default {
  props: {
    cardList: {
      type: Array,
      required: true,
    },
    columnId: {
      type: Number,
      required: true
    },
    openModal: {
      type: Function,
      required: true,
    }
  },
  data() {
    return {
      drag: false,
    };
  },
  methods: {
    updateColumnId({ added }) {
      this.cardList.forEach(card => {
        if (card.columnId !== this.columnId) {
          card.columnId = this.columnId
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.ghost
  opacity: 0.5
</style>