<template lang="pug"> 
.p-5
  parts-kanban-column(:kanban="selectionList" :openModal="openModal")
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
          v-select.text-sm.text-gray-300(
            v-model="currentCard.recruitmentSelectionId"
            placeholder="未入力"
            :options="selectionList"
            label="name"
            :reduce="selection => selection.id"
            :class="'v-select-custom-style'"
            @input="update('recruitmentSelectionId')"
          )
            template(#selected-option="option")
              .inline-block.text-xs.rounded.bg-gray-100.px-2(:class="'py-0.5'") {{ option.name }}
            template(v-slot:option="option")
              .inline-block.text-xs.rounded.bg-gray-100.px-2(:class="'py-0.5'") {{ option.name }}
      .grid.grid-cols-6.mb-2.items-center
        .text-sm 担当者
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.recruiter"
            placeholder="未入力"
            :options="recruiterList"
            label="nickname"
            :class="'v-select-custom-style'"
            @input="updateAssociation('recruiter')"
          )
            template(#selected-option="option")
              parts-recruiter(:recruiter="option")
            template(v-slot:option="option")
              parts-recruiter(:recruiter="option")
      .grid.grid-cols-6.mb-2.items-center
        .text-sm 応募媒体
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.channel"
            placeholder="未入力"
            :options="channelList"
            label="name"
            :class="'v-select-custom-style'"
            @input="updateAssociation('channel')"
          )
            template(#selected-option="option")
              parts-channel(:channel="option")
            template(v-slot:option="option")
              parts-channel(:channel="option")
      .grid.grid-cols-6.mb-2.items-center
        .text-sm ポジション
        .col-start-2.col-span-5
          v-select.text-sm.text-gray-300(
            v-model="currentCard.position"
            placeholder="未入力"
            :options="positionList"
            label="internalName"
            :class="'v-select-custom-style'"
            @input="updateAssociation('position')"
          )
            template(#selected-option="option")
              parts-position(:position="option")
            template(v-slot:option="option")
              parts-position(:position="option")

      //- 選考履歴
      .bg-white.w-full.rounded.border.border-gray-200.mb-3(v-for="history in currentCard.recruitmentHistories" :key="history.id")
        .bg-gray-100.px-3.py-2.flex.justify-content-start.items-center
          h3.text-sm.mr-5 {{ history.recruitmentSelection.name }}
          .text-sm.text-gray-500(
            v-if="['document', 'interview'].includes(history.recruitmentSelection.selectionType)"
          )
            v-select.text-sm.text-gray-500.w-32(
              v-model="history.result"
              placeholder="未選考"
              :options="resultList"
              label="ja"
              :reduce="result => result.en"
              :class="'v-select-custom-style-bg-gray'"
              @input="updateHistory(history, 'result')"
            )
              template(#selected-option="option")
                .text-gray-500 {{ option.ja }}
              template(v-slot:option="option")
                .text-gray-500 {{ option.ja }}
          .text-sm.text-gray-500.ml-auto
            v-date-picker(
              v-model="history.selectedAt"
              :masks="{ input: 'YYYY.MM.DD' }"
              :popover="{ visibility: 'focus' }"
              trim-weeks
              @input="updateHistory(history, 'selectedAt')"
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
import Candidate from '../models/Candidate'
import Channel from '../models/Channel'
import Position from '../models/Position'
import Recruiter from '../models/Recruiter'
import RecruitmentHistory, { resultList } from '../models/RecruitmentHistory'
import RecruitmentSelection from '../models/RecruitmentSelection'

export default {
  async fetch({ $axios }) {
    const { data: selectionList } = await $axios.get('/recruitment_selections')
    const { data: recruiterList } = await $axios.get('/recruiters')
    const { data: channelList } = await $axios.get('/channels')
    const { data: positionList } = await $axios.get('/positions')

    RecruitmentSelection.insertOrUpdate({ data: selectionList })
    Recruiter.insertOrUpdate({ data: recruiterList })
    Channel.insertOrUpdate({ data: channelList })
    Position.insertOrUpdate({ data: positionList })
  },
  async asyncData({ $axios }) {
    const { data: kanban } = await $axios.get('/recruitment_selections')

    return {
      kanban,
    }
  },
  data() {
    return {
      currentCard: null,
      resultList,
    }
  },
  methods: {
    openModal(card) {
      this.currentCard = card
      this.$refs.kanbanModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    },
    async update(field) {
      // 更新したフィールドのみ更新を走らせる
      const fieldSnakeCase = field.replace(
        /[A-Z]/g,
        (s) => '_' + s[0].toLowerCase()
      )
      let candidate = {}
      candidate[fieldSnakeCase] = this.currentCard[field]
      const { data } = await this.$axios.put(
        `/candidates/${this.currentCard.id}`,
        { candidate }
      )
      Candidate.update({ data })
    },
    async updateAssociation(association) {
      // 更新したフィールドのみ更新を走らせる
      const acSnakeCase = association.replace(
        /[A-Z]/g,
        (s) => '_' + s[0].toLowerCase()
      )
      let candidate = {}
      candidate[`${acSnakeCase}_id`] = this.currentCard[association].id
      const { data } = await this.$axios.put(
        `/candidates/${this.currentCard.id}`,
        { candidate }
      )
      Candidate.update({ data })
    },
    async updateHistory(currentHistory, field) {
      // 更新したフィールドのみ更新を走らせる
      const fieldSnakeCase = field.replace(
        /[A-Z]/g,
        (s) => '_' + s[0].toLowerCase()
      )
      let history = {}
      history[fieldSnakeCase] = currentHistory[field]
      const { data } = await this.$axios.put(
        `/recruitment_histories/${currentHistory.id}`,
        { history }
      )
      RecruitmentHistory.update({ data })
    },
  },
  computed: {
    selectionList() {
      return RecruitmentSelection.query().withAllRecursive().all()
    },
    recruiterList() {
      return Recruiter.all()
    },
    channelList() {
      return Channel.all()
    },
    positionList() {
      return Position.all()
    },
  },
}
</script>

<style lang="sass"></style>
