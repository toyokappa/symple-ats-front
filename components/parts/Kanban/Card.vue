<template lang="pug"> 
draggable(
  :list="cardList"
  group="kanban"
  @start="drag = true"
  @end="drag = false"
  ghostClass="ghost"
  :animation="200"
  :disabled="false",
  :emptyInsertThreshold="100"
  item-key="id"
)
  .bg-white.rounded.border.border-gray-200.shadow-sm.p-3.mb-2.cursor-pointer(v-for="card in cardList" :key="card.id" @click="openModal(card)")
    .text-sm.mb-1(v-if="card.name") {{ card.name }}
    .text-sm.text-gray-300.mb-1(v-else) 名前未入力
    parts-recruiter.mb-1(:recruiterId="card.recruiterId")
    parts-media(:mediaId="card.mediaId")
    .mb-1
    parts-position(:positionId="card.positionId")
    .mb-2
    parts-started-date(:date="card.startedDate")
</template>

<script>
export default {
  props: {
    cardList: {
      type: Array,
      required: true,
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
}
</script>

<style lang="sass" scoped>
.ghost
  opacity: 0.5
</style>