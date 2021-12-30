<template lang="pug"> 
draggable(
  :list="kanban"
  @start="drag = true"
  @end="drag = false"
  ghostClass="ghost"
  :animation="200"
  :disabled="false",
  item-key="id"
)
  transition-group(class="d-inline-flex" type="transition" :name="!drag ? 'flip-list' : null")
    v-card.mx-2(
      v-for="column in kanban" :key="column.id"
      outlined
      width="18rem"
    )
      .grey.lighten-3.px-3.py-2.d-flex.justify-start.cursor-pointer
        h3.text-body-2.font-weight-bold.me-2 {{ column.name }}
        .text-body-2.grey--text {{ column.candidates.length }}
      .kanban-column.white.pa-3.overflow-y-scroll
        parts-kanban-card(
          :cardList="column.candidates"
          :columnId="column.id"
          :openModal="openModal"
        )
        .bg-white.rounded.border.border-gray-200.px-3.py-2.mb-2(v-show="createColumnId === column.id")
          input.text-sm.outline-none(
            type="text"
            placeholder="候補者名を入力"
            :ref="`column${column.id}`"
            v-model="nameField"
            @keydown.enter="appendCard"
            @blur="appendCard"
          )
        v-card(
          v-if="['document', 'interview', 'offer', 'consent'].includes(column.selectionType)"
          outlined
          link
          @click="displayCreateForm(column.id)"
        )
          v-card-text + 新規作成
</template>

<script>
import Candidate from '../../../models/Candidate'
export default {
  props: {
    kanban: {
      type: Array,
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
      createColumnId: null,
      nameField: '',
    }
  },
  methods: {
    displayCreateForm(columnId) {
      this.createColumnId = columnId
      this.$nextTick(() => {
        this.$refs[`column${columnId}`][0].focus()
      })
    },
    async appendCard(event) {
      if (event.keyCode && event.keyCode !== 13) return // 日本語変換確定のエンターは対象外
      if (!this.createColumnId) return // keydownとblurが2重発火するのでその対策

      const column = this.kanban.find(
        (column) => column.id === this.createColumnId
      )
      const { data } = await this.$axios.post('/candidates', {
        candidate: {
          recruitment_selection_id: column.id,
          name: this.nameField,
        },
      })

      Candidate.insert({ data })
      this.createColumnId = null
      this.nameField = ''
    },
  },
}
</script>

<style lang="sass" scoped>
.ghost
  opacity: 0.5
.kanban-column
  max-height: calc(100vh - 36px - 2.5rem)
</style>
