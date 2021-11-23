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
            .inline-block.text-xs.rounded.bg-gray-100.px-2(v-if="currentColumn.id > 1" :class="'py-0.5'") {{ currentColumn.name }}
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
// TODO: データ基盤ができたらいずれは削除
import { kanban, recruiterList, mediaList, positionList } from '@/fixtures'

export default {
  data() {
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
</style>