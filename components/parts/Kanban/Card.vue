<template lang="pug"> 
draggable(
  :list="cardList"
  group="kanban"
  @start="drag = true"
  @end="drag = false"
  @change="sort"
  ghostClass="ghost"
  :animation="200"
  :disabled="false",
  :emptyInsertThreshold="100"
  item-key="id"
)
  v-card.mb-2(
    v-for="card in cardList"
    :key="card.id"
    @click="openModal(card)"
  )
    v-card-text
      .body-2(v-if="card.name") {{ card.name }}
      .body-2.grey--text(v-else) 名前未入力
      .mt-1(v-if="card.recruiter")
        v-avatar.me-1(
          color="grey"
          size="18"
        )
          span.white--text.subtitle-2 t
        span.subtitle-2 {{ card.recruiter.nickname }}
      .mt-1(v-if="card.channel")
        v-chip(
          :color="card.channel.categoryColor + ' lighten-1'"
          small
          label
        )
          .white--text.font-weight-bold {{ card.channel.name }}
      .mt-1(v-if="card.position")
        v-chip(
          small
          label
        )
          .white--text.font-weight-bold {{ card.position.internalName }}
</template>

<script>
import Candidate from '../../../models/Candidate'
export default {
  props: {
    cardList: {
      type: Array,
      required: true,
    },
    columnId: {
      type: Number,
      required: true,
    },
    openModal: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      drag: false,
    }
  },
  methods: {
    async sort({ added, moved, removed }) {
      if (removed) return

      const { element, newIndex } = added || moved

      // 描画のために暫定的に1回アップデートを掛ける
      Candidate.update({
        where: element.id,
        data: {
          recruitmentSelectionId: this.columnId,
          listPosition: newIndex + 1,
        },
      })
      const { data } = await this.$axios.put(
        `/candidates/${element.id}/position`,
        {
          candidate: {
            recruitment_selection_id: this.columnId,
            list_position: newIndex + 1,
          },
        }
      )

      // 採用履歴が増える可能性もあるのでAPIからのデータを注入
      Candidate.insertOrUpdate({ data })
    },
  },
}
</script>

<style lang="sass" scoped>
.ghost
  opacity: 0.5
</style>
