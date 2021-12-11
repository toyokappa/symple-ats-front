<template lang="pug"> 
.p-5
  parts-kanban-column(:kanban="kanban" :openModal="openModal")
  parts-modal(ref="kanbanModal")
    template(v-if="currentCard")
      parts-form-title-like-text-field(
        v-model="currentCard.name"
        @updateEvent="update('name')"
        ref="nameField"
      )
      .grid.grid-cols-6.mb-2.items-center
        .text-sm 選考状態
        .col-start-2.col-span-5
          .px-2.py-1
            .inline-block.text-xs.rounded.bg-gray-100.px-2(:class="'py-0.5'") {{ currentColumn.name }}
      .grid.grid-cols-6.mb-2.items-center
        .text-sm 担当者
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.recruiter"
            placeholder="未入力"
            :options="recruiterList"
            label="nickname"
            :class="'v-select-custom-style'"
          )
            template(#selected-option="option")
              parts-recruiter(:recruiter="option")
            template(v-slot:option="option")
              parts-recruiter(:recruiter="option")
      .grid.grid-cols-6.mb-2.items-center
        .text-sm 応募媒体
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.medium"
            placeholder="未入力"
            :options="media"
            label="name"
            :class="'v-select-custom-style'"
          )
            template(#selected-option="option")
              parts-medium(:medium="option")
            template(v-slot:option="option")
              parts-medium(:medium="option")
      .grid.grid-cols-6.mb-2.items-center
        .text-sm ポジション
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.position"
            placeholder="未入力"
            :options="positionList"
            label="internalName"
            :class="'v-select-custom-style'"
          )
            template(#selected-option="option")
              parts-position(:position="option")
            template(v-slot:option="option")
              parts-position(:position="option")

      //- 選考履歴
      .bg-white.w-full.rounded.border.border-gray-200.mb-3(v-for="history in currentCard.recruitmentHistories" :key="history.id")
        .bg-gray-100.px-3.py-2.flex.justify-content-start.items-center
          h3.text-sm.mr-5 {{ findColumn(history.recruitmentSelectionId).name }}
          .text-sm.text-gray-500
            v-select.text-sm.text-gray-500.w-32(
              v-model="history.result"
              placeholder="未選考"
              :options="[{ label: '合格', value: 'pass'}, { label: '不合格', value: 'failure' }]"
              :reduce="option => option.value"
              label="label"
              :class="'v-select-custom-style-bg-gray'"
            )
              template(#selected-option="option")
                .text-gray-500 {{ option.label }}
          .text-sm.text-gray-500.ml-auto
            v-date-picker(
              v-model="history.selectedAt"
              :masks="{ input: 'YYYY.MM.DD' }"
              :popover="{ visibility: 'focus' }"
              trim-weeks
            )
              template(v-slot="{ inputValue, inputEvents }")
                input.text-sm.text-right.w-24.px-2.py-1.outline-none.rounded.bg-gray-100(
                  :class="'hover:bg-white focus:bg-white'"
                  :value="inputValue"
                  v-on="inputEvents"
                  placeholder="未入力"
                )

        //- 選考評価
        .bg-white.p-3
        //-   .bg-white.rounded.border.border-gray-200.shadow-sm.p-4.mb-2(v-for="iResult in result.individualResults" :key="iResult.id")
        //-     .grid.grid-cols-8.mb-3.items-center
        //-       .text-sm 選考官
        //-       .col-start-2.col-span-7
        //-         parts-recruiter(:recruiterId="iResult.recruiterId")
        //-     .grid.grid-cols-8.mb-3.items-center
        //-       .text-sm 結果
        //-       .col-start-2.col-span-7
        //-         .text-sm {{ iResult.result }}
        //-     .grid.grid-cols-8.mb-3.items-center
        //-       .text-sm 入力日
        //-       .col-start-2.col-span-7
        //-         parts-date.text-sm(:date="iResult.inputDate")
        //-     .text-sm {{ iResult.description }}
</template>

<script>
// TODO: データ基盤ができたらいずれは削除
export default {
  async asyncData({ $axios }) {
    const { data: kanban } = await $axios.get('/recruitment_selections')
    const { data: recruiterList } = await $axios.get('/recruiters')
    const { data: media } = await $axios.get('/media')
    const { data: positionList } = await $axios.get('/positions')

    return {
      kanban,
      recruiterList,
      media,
      positionList,
    }
  },
  data() {
    return {
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
    update(field) {
      // 更新したフィールドのみ更新を走らせる
      const fieldSnakeCase = field.replace(/[A-Z]/g, s => '_' + s[0].toLowerCase())
      let candidate = {}
      candidate[fieldSnakeCase] = this.currentCard[field]
      this.$axios.put(`/candidates/${this.currentCard.id}`, { candidate })
    },
    findColumn(columnId) {
      return this.kanban.find(column => column.id == columnId)
    }
  },
  computed: {
    currentColumn() {
      return this.kanban.find(column => column.id === this.currentCard.recruitmentSelectionId)
    }
  },
  // モーダル切替時にも更新が走ってしまうので要修正
  watch: {
    'currentCard.recruiter': function(recruiter) {
      const candidate = { recruiter_id: recruiter?.id || null }
      this.$axios.put(`/candidates/${this.currentCard.id}`, { candidate })
    },
    'currentCard.medium': function(medium) {
      const candidate = { medium_id: medium?.id || null }
      this.$axios.put(`/candidates/${this.currentCard.id}`, { candidate })
    },
    'currentCard.position': function(position) {
      const candidate = { position_id: position?.id || null }
      this.$axios.put(`/candidates/${this.currentCard.id}`, { candidate })
    },
    'currentCard.recruitmentStartedAt': function(date) {
      const candidate = { recruitment_started_at: date }
      this.$axios.put(`/candidates/${this.currentCard.id}`, { candidate })
    },
  }
}
</script>

<style lang="sass">
</style>