<template lang="pug"> 
.p-5
  parts-kanban-column(
    :kanban="selectionList"
    :openDialog="openDialog"
  )
  template(v-if="currentCard")
    v-dialog(
      v-model="dialog"
      max-width="800"
    )
      v-card
        v-container
          v-card-text
            v-text-field.text-h5.font-weight-bold.mb-2(
              v-model="currentCard.name"
              flat
              solo
              dense
              autofocus
              placeholder="名前未入力"
              hide-details="auto"
              @blur="update('name')"
            )
            v-container
              v-row(
                dense
              )
                v-col.py-2.grey--text(
                  cols="2"
                ) 選考状況
                v-col.py-0(
                  cols="10"
                )
                  v-autocomplete.body-2(
                    v-model="currentCard.recruitmentSelectionId"
                    append-icon=""
                    :items="selectionList"
                    item-text="name"
                    item-value="id"
                    :flat="flat.recruitmentSelectionId"
                    solo
                    dense
                    hide-details="auto"
                    @focus="flat.recruitmentSelectionId = false"
                    @blur="update('recruitmentSelectionId')"
                  )
                    template(v-slot:selection="{ item }")
                      v-chip(
                        small
                        label
                      ) {{ item.name }}
                    template(v-slot:item="{ item }")
                      v-chip(
                        small
                        label
                       ) {{ item.name }}
              v-row(
                dense
              )
                v-col.py-2.grey--text(
                  cols="2"
                ) 採用担当
                v-col.py-0(
                  cols="10"
                )
                  v-autocomplete.body-2(
                    v-model="currentCard.recruiterId"
                    append-icon=""
                    :items="recruiterList"
                    item-text="nickname"
                    item-value="id"
                    :flat="flat.recruiterId"
                    solo
                    dense
                    hide-details="auto"
                    @focus="flat.recruiterId = false"
                    @blur="update('recruiterId')"
                  )
                    template(v-slot:selection="{ item }")
                      v-avatar.me-1(
                        color="grey"
                        size="18"
                      )
                        span.white--text.subtitle-2 {{ item.nickname[0] }}
                      span.subtitle-2 {{ item.nickname }}
                    template(v-slot:item="{ item }")
                      v-avatar.me-1(
                        color="grey"
                        size="18"
                      )
                        span.white--text.subtitle-2 {{ item.nickname[0] }}
                      span.subtitle-2 {{ item.nickname }}
              v-row(
                dense
              )
                v-col.py-2.grey--text(
                  cols="2"
                ) 応募経路
                v-col.py-0(
                  cols="10"
                )
                  v-autocomplete.body-2(
                    v-model="currentCard.channelId"
                    append-icon=""
                    :items="channelList"
                    item-text="name"
                    item-value="id"
                    :flat="flat.channelId"
                    solo
                    dense
                    hide-details="auto"
                    @focus="flat.channelId = false"
                    @blur="update('channelId')"
                  )
                    template(v-slot:selection="{ item }")
                      v-chip(
                        :color="item.categoryColor + ' lighten-1'"
                        small
                        label
                      )
                        .white--text.font-weight-bold {{ item.name }}
                    template(v-slot:item="{ item }")
                      v-chip(
                        :color="item.categoryColor + ' lighten-1'"
                        small
                        label
                      )
                        .white--text.font-weight-bold {{ item.name }}
              v-row(
                dense
              )
                v-col.py-2.grey--text(
                  cols="2"
                ) ポジション
                v-col.py-0(
                  cols="10"
                )
                  v-autocomplete.body-2(
                    v-model="currentCard.positionId"
                    append-icon=""
                    :items="positionList"
                    item-text="internalName"
                    item-value="id"
                    :flat="flat.positionId"
                    solo
                    dense
                    hide-details="auto"
                    @focus="flat.positionId = false"
                    @blur="update('positionId')"
                  )
                    template(v-slot:selection="{ item }")
                      v-chip(
                        small
                        label
                       ) {{ item.internalName }}
                    template(v-slot:item="{ item }")
                      v-chip(
                        small
                        label
                      ) {{ item.internalName }}
            v-container
              v-card.mb-3(
                v-for="history in currentCard.recruitmentHistories" :key="history.id"
                outlined
              )
                .grey.lighten-3.px-3.py-2.cursor-pointer
                  v-row(
                    align="center"
                  )
                    v-col(
                      cols="5"
                    )
                      .d-flex.align-center
                        .text-body-2.font-weight-bold.me-2 {{ history.recruitmentSelection.name }}
                        v-autocomplete.body-2.grey--text.history-result(
                          v-if="['document', 'interview'].includes(history.recruitmentSelection.selectionType)"
                          v-model="history.result"
                          append-icon=""
                          :items="resultList"
                          item-text="ja"
                          item-value="en"
                          placeholder="未入力"
                          :background-color="history.editing ? 'inherit' : 'transparent'"
                          :flat="!history.editing"
                          solo
                          dense
                          hide-details="auto"
                          :ref="`history${history.id}`"
                          @focus="history.editing = true"
                          @blur="updateHistory(history, 'result')"
                        )
                    v-col(
                      offset="4"
                      cols="3"
                    )
                      .text-body-2(
                      ) 2021.12.31
  //- parts-modal(ref="kanbanModal")
    template(v-if="currentCard")

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
import Candidate from '@/models/Candidate'
import Channel from '@/models/Channel'
import Position from '@/models/Position'
import Recruiter from '@/models/Recruiter'
import RecruitmentHistory, { resultList } from '@/models/RecruitmentHistory'
import RecruitmentSelection from '@/models/RecruitmentSelection'

export default {
  layout: 'signedIn',
  async fetch({ $axios, $auth }) {
    const orgId = $auth.user.organization.uniqueId
    const { data: selectionList } = await $axios.get(
      `/${orgId}/recruitment_selections`
    )
    const { data: recruiterList } = await $axios.get(`/${orgId}/recruiters`)
    const { data: channelList } = await $axios.get(`/${orgId}/channels`)
    const { data: positionList } = await $axios.get(`/${orgId}/positions`)

    RecruitmentSelection.insertOrUpdate({ data: selectionList })
    Recruiter.insertOrUpdate({ data: recruiterList })
    Channel.insertOrUpdate({ data: channelList })
    Position.insertOrUpdate({ data: positionList })
  },
  data() {
    return {
      dialog: false,
      currentCard: null,
      resultList,
      flat: {
        recruitmentSelectionId: true,
        recruiterId: true,
        channelId: true,
        positionId: true,
        result: true,
      },
    }
  },
  methods: {
    openDialog(card) {
      this.currentCard = card
      this.dialog = true
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
      this.flat[field] = true
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
      currentHistory.editing = false
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

<style lang="sass">
.history-result
  .v-input__control
    min-height: inherit !important
</style>
