<template lang="pug"> 
.mx-auto.my-3
  parts-kanban-column(:kanban="kanban" :openModal="openModal")
  parts-modal(ref="kanbanModal")
    template(v-if="currentCard")
      input.text-3xl.font-bold.outline-none.placeholder-gray-300.mb-5(
        type="text"
        v-model="currentCard.name"
        placeholder="名前未入力"
        ref="nameField"
      )
      .grid.grid-cols-6.mb-2.items-center
        .text-sm 選考状態
        .col-start-2.col-span-5
          .px-2.py-1
            .inline-block.text-xs.rounded.bg-gray-100.px-2(v-if="currentColumn.id > 1" :class="`py-0.5`") {{ currentColumn.name }}
            .text-sm.text-gray-300(v-else) 未入力
      .grid.grid-cols-6.mb-2.items-center
        .text-sm 担当者
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.recruiterId"
            placeholder="未入力"
            :options="recruiterList"
            :reduce="recruiter => recruiter.id"
            label="name"
            :class="'v-select-custom-style'"
          )
            template(#selected-option="option")
              parts-recruiter(:recruiterId="option.id")
            template(v-slot:option="option")
              parts-recruiter(:recruiterId="option.id")
      .grid.grid-cols-6.mb-2.items-center
        .text-sm 応募媒体
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.mediaId"
            placeholder="未入力"
            :options="mediaList"
            :reduce="media => media.id"
            label="name"
            :class="'v-select-custom-style'"
          )
            template(#selected-option="option")
              parts-media(:mediaId="option.id")
            template(v-slot:option="option")
              parts-media(:mediaId="option.id")
      .grid.grid-cols-6.mb-2.items-center
        .text-sm ポジション
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.positionId"
            placeholder="未入力"
            :options="positionList"
            :reduce="postion => postion.id"
            label="name"
            :class="'v-select-custom-style'"
          )
            template(#selected-option="option")
              parts-position(:positionId="option.id")
            template(v-slot:option="option")
              parts-position(:positionId="option.id")
      .grid.grid-cols-6.mb-3.items-center
        .text-sm 選考開始日
        .col-start-2.col-span-5
          v-date-picker(
            v-model="currentCard.startedDate"
            :masks="{ input: 'YYYY.MM.DD' }"
            :popover="{ visibility: 'focus' }"
            trim-weeks
          )
            template(v-slot="{ inputValue, inputEvents }")
              input.text-sm.px-2.py-1.w-full.outline-none.rounded.placeholder-gray-300(
                :class="'hover:bg-gray-100 focus:bg-gray-100'"
                :value="inputValue"
                v-on="inputEvents"
                placeholder="未入力"
              )
      .bg-white.w-full.rounded.border.border-gray-200.mb-3(v-for="result in currentCard.selectionResults" :key="result.id")
        .bg-gray-100.px-3.py-2.flex.justify-content-start
          h3.text-sm.mr-5 {{ result.columnName }}
          .text-sm.text-gray-500 {{ result.totalResult }}
        .bg-white.p-3
          .bg-white.rounded.border.border-gray-200.shadow-sm.p-4.mb-2(v-for="iResult in result.individualResults" :key="iResult.id")
            .grid.grid-cols-8.mb-3.items-center
              .text-sm 選考官
              .col-start-2.col-span-7
                parts-recruiter(:recruiterId="iResult.recruiterId")
            .grid.grid-cols-8.mb-3.items-center
              .text-sm 結果
              .col-start-2.col-span-7
                .text-sm {{ iResult.result }}
            .grid.grid-cols-8.mb-3.items-center
              .text-sm 入力日
              .col-start-2.col-span-7
                parts-date.text-sm(:date="iResult.inputDate")
            .text-sm {{ iResult.description }}
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
            columnId: 1,
            name: "シンプル 太郎",
            recruiterId: 1,
            mediaId: 1,
            positionId: 1,
            startedDate: new Date("2021.11.01"),
            selectionResults: [
              {
                id: 1,
                columnId: 2,
                columnName: '書類選考', // 暫定的に追加
                totalResult: '合格',
                individualResults: [
                  {
                    id: 1,
                    selectionResultId: 1,
                    recruiterId: 1,
                    result: '合格',
                    inputDate: new Date("2021.11.10"),
                    description: 'とても良かったです。'
                  },
                  {
                    id: 2,
                    selectionResultId: 1,
                    recruiterId: 2,
                    result: '不合格',
                    inputDate: new Date("2021.11.11"),
                    description: '若干悩んだ。'
                  },
                ]
              },
              {
                id: 2,
                columnId: 3,
                columnName: '1次面接', // 暫定的に追加
                totalResult: '不合格',
                individualResults: [
                  {
                    id: 1,
                    selectionResultId: 2,
                    recruiterId: 1,
                    result: '不合格',
                    inputDate: new Date("2021.11.12"),
                    description: '話した感じ物足りなかったです。'
                  },
                ]
              }
            ]
          },
          {
            id: 2,
            columnId: 1,
            name: "シンプル 次郎",
            recruiterId: 2,
            mediaId: 2,
            positionId: 2,
            startedDate: new Date("2021.11.02"),
            selectionResults: [],
          },
        ],
      },
      {
        id: 2,
        name: '書類選考',
        list: [
          {
            id: 3,
            columnId: 2,
            name: "シンプル 三郎",
            recruiterId: 3,
            mediaId: 3,
            positionId: 3,
            startedDate: new Date("2021.11.03"),
            selectionResults: [],
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
    const recruiterList = [
      {
        id: 1,
        name: 'toyokawa',
      },
      {
        id: 2,
        name: 'yamada',
      },
      {
        id: 3,
        name: 'tanaka',
      },
    ]
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
      kanban,
      recruiterList,
      mediaList,
      positionList,
      currentCard: null,
    };
  },
  methods: {
    openModal(card) {
      this.currentCard = card
      this.$refs.kanbanModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    },
  },
  computed: {
    currentColumn() {
      return this.kanban.find(column => column.id === this.currentCard.columnId)
    }
  }
}
</script>

<style lang="sass">
.v-select-custom-style
  &.vs--single.vs--open
    .vs__dropdown-toggle
      background-color: rgba(243, 244, 246, 1)
    .vs__selected
      opacity: 1
  .vs__dropdown-toggle
    outline: none
    border: none
    &:hover
      background-color: rgba(243, 244, 246, 1)
  .vs__dropdown-option
    padding: 0.25rem 0.5rem
    &--highlight
      background-color: rgba(243, 244, 246, 1)
</style>