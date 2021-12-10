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
  transition-group(class="inline-flex" type="transition" :name="!drag ? 'flip-list' : null")
    .bg-white.w-72.rounded.border.border-gray-200.mx-2(v-for="column in kanban" :key="column.id")
      .bg-gray-100.px-3.py-2.flex.justify-content-start.cursor-pointer
        h3.text-sm.mr-2 {{ column.name }}
        .text-sm.text-gray-500 {{ column.candidates.length }}
      .bg-white.p-3
        parts-kanban-card(:cardList="column.candidates" :columnId="column.id" :openModal="openModal")
        .bg-white.rounded.border.border-gray-200.px-3.py-2.mb-2(v-show="createColumnId === column.id")
          input.text-sm.outline-none(
            type="text"
            placeholder="候補者名を入力"
            :ref="`column${column.id}`"
            v-model="nameField"
            @keydown.enter="appendCard"
            @blur="appendCard"
          )
        .bg-white.rounded.border.border-gray-200.px-3.py-2.cursor-pointer(@click="displayCreateForm(column.id)")
          .text-sm.text-gray-400 + 新規作成
</template>

<script>
export default {
  props: {
    kanban: {
      type: Array,
      required: true
    },
    openModal: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      drag: false,
      createColumnId: null,
      nameField: ""
    };
  },
  methods: {
    displayCreateForm(columnId) {
      this.createColumnId = columnId
      this.$nextTick(() =>{
        this.$refs[`column${columnId}`][0].focus()
      })
    },
    appendCard(event) {
      if (event.keyCode && event.keyCode !== 13) return // 日本語変換確定のエンターは対象外
      if (!this.createColumnId) return // keydownとblurが2重発火するのでその対策

      const column = this.kanban.find(column => column.id === this.createColumnId)
      column.candidates.push({
        id: column.candidates.length + 1,
        recruitmentSelectionId: column.id,
        name: this.nameField,
        recruiter: null,
        media: null,
        position: null,
        recruitmentStartedAt: new Date(),
      })
      this.createColumnId = null
      this.nameField = ""
    }
  },
}
</script>

<style lang="sass" scoped>
.ghost
  opacity: 0.5
</style>