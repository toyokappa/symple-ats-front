<template lang="pug"> 
.mx-auto.my-3
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
        .bg-gray-100.px-3.py-2.flex.justify-content-start
          h3.text-sm.mr-2 {{ column.name }}
          .text-sm.text-gray-500 {{ column.list.length }}
        .bg-white.p-3
          draggable(
            :list="column.list"
            group="kanban"
            @start="drag = true"
            @end="drag = false"
            ghostClass="ghost"
            :animation="200"
            :disabled="false",
            :emptyInsertThreshold="100"
            item-key="order"
          )
            .bg-white.rounded.border.border-gray-200.shadow-sm.p-3.mb-2(v-for="item in column.list" :key="item.id")
              .text-sm.mb-1(v-if="item.name") {{ item.name }}
              .text-sm.text-gray-400.mb-1(v-else) 名前未入力
              .flex.items-center.mb-1(v-if="item.recruiter")
                .w-5.h-5.bg-gray-100.rounded-full.mr-1
                .text-xs {{ item.recruiter.name }}
              .inline-block.text-xs.rounded.px-2(v-if="item.media" :class="`bg-${item.media.color}-100 py-0.5`") {{ item.media.name }}
              .mb-1
              .inline-block.text-xs.rounded.px-2(v-if="item.position" :class="`bg-${item.position.color}-100 py-0.5`") {{ item.position.name }}
              .mb-2
              .text-xs {{ item.startedDate }}
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
  data() {
    const kanban = [
      {
        id: 1,
        name: '未選考状態',
        list: [
          {
            id: 1,
            name: "シンプル 太郎",
            recruiter: {
              name: "toyokawa",
            },
            media: {
              name: "Green",
              color: "green",
            },
            position: {
              name: "エンジニア",
              color: "blue",
            },
            startedDate: "2021.11.01",
          },
          {
            id: 2,
            name: "シンプル 次郎",
            recruiter: {
              name: "toyokawa",
            },
            media: {
              name: "JAC",
              color: "red",
            },
            position: {
              name: "エンジニア",
              color: "blue",
            },
            startedDate: "2021.11.01",
          },
        ],
      },
      {
        id: 2,
        name: '書類選考',
        list: [
          {
            id: 3,
            name: "シンプル 三郎",
            recruiter: {
              name: "toyokawa",
            },
            media: {
              name: "Wantedly",
              color: "green",
            },
            position: {
              name: "デザイナー",
              color: "yellow",
            },
            startedDate: "2021.11.01",
          },
        ],
      },
      {
        id: 3,
        name: '1次面接',
        list: [
        ],
      },
      {
        id: 4,
        name: '2次面接',
        list: [
        ],
      },
      {
        id: 5,
        name: '内定',
        list: [
        ],
      },
      {
        id: 6,
        name: '内定承諾',
        list: [
        ],
      },
    ]
    return {
      kanban,
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
      const startedDate = this.$dateFns.format(new Date(), "yyyy.MM.dd")
      column.list.push({ id: column.list.length + 1, name: this.nameField, recruiter: null, media: null, position: null, startedDate })
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