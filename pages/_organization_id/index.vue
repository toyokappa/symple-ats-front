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
                    dense
                  )
                    v-col(cols="3")
                      .d-flex.align-center
                        .text-body-2.text-no-wrap.font-weight-bold.me-2 {{ history.recruitmentSelection.name }}
                        v-autocomplete.body-2.grey--text(
                          v-if="['document', 'interview'].includes(history.recruitmentSelection.selectionType)"
                          v-model="history.result"
                          append-icon=""
                          :items="resultList"
                          item-text="ja"
                          item-value="en"
                          placeholder="結果未入力"
                          :background-color="history.resultEditing ? 'inherit' : 'transparent'"
                          :flat="!history.resultEditing"
                          solo
                          dense
                          hide-details="auto"
                          :ref="`history${history.id}`"
                          @focus="history.resultEditing = true"
                          @blur="history.resultEditing = false"
                          @input="updateHistory(history, 'result')"
                        )
                    v-col(cols="7")
                      template(v-if="['interview'].includes(history.recruitmentSelection.selectionType)")
                        v-btn(
                          v-if="!history.autoSchedulingToken"
                          block
                          outlined
                          dense
                          @click="createAutoSchedulingToken(history.id)"
                        ) 日程の自動調整を行う
                        v-text-field.caption(
                          v-else
                          :value="history.autoSchedulingUrl($route.params.organization_id)"
                          readonly
                          append-icon="mdi-content-copy"
                          outlined
                          dense
                          hide-details="auto"
                          @click="copyUrl"
                        )
                    v-col(cols="2")
                      v-menu(
                        v-model="history.selectedAtEditing"
                        :close-on-content-click="false"
                        offset-y
                      )
                        template(v-slot:activator="{ on, attrs }")
                          v-text-field.body-2.selected-at(
                            :value="history.selectedAt ? $dateFns.format(history.selectedAtToDate, 'yyyy.MM.dd') : null"
                            placeholder="日程未入力"
                            hide-details="auto"
                            :background-color="history.selectedAtEditing ? 'inherit' : 'transparent'"
                            :flat="!history.selectedAtEditing"
                            solo
                            dense
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          )
                        v-date-picker(
                          v-model="history.selectedAt"
                          no-title
                          @input="updateHistory(history, 'selectedAt')"
                        )
                v-divider
                .white
                  v-container
                    v-card.mb-3(
                      v-for="evaluation in history.recruitmentEvaluations"
                      :key="evaluation.id"
                    )
                      v-container.pa-5
                        v-row(dense)
                          v-col.py-2.grey--text(cols="2") 面接官
                          v-col.py-0(cols="10")
                            v-autocomplete.body-2(
                              v-model="evaluation.recruiterId"
                              append-icon=""
                              :items="recruiterList"
                              item-text="nickname"
                              item-value="id"
                              :flat="!evaluation.recruiterIdEditing"
                              solo
                              dense
                              hide-details="auto"
                              @focus="evaluation.recruiterIdEditing = true"
                              @blur="evaluation.recruiterIdEditing = false"
                              @input="updateEvaluation(evaluation, 'recruiterId')"
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
                        v-row(dense)
                          v-col.py-2.grey--text(cols="2") 結果
                          v-col.py-0(cols="10")
                            v-autocomplete.body-2.grey--text(
                              v-model="evaluation.result"
                              append-icon=""
                              :items="resultList"
                              item-text="ja"
                              item-value="en"
                              placeholder="未入力"
                              :flat="!evaluation.resultEditing"
                              solo
                              dense
                              hide-details="auto"
                              @focus="evaluation.resultEditing = true"
                              @blur="evaluation.resultEditing = false"
                              @input="updateEvaluation(evaluation, 'result')"
                            )
                        v-row(dense)
                          v-col.py-2.grey--text(cols="2") 入力日
                          v-col.py-0(cols="10")
                            v-menu(
                              v-model="evaluation.inputAtEditing"
                              :close-on-content-click="false"
                              offset-y
                              min-width="auto"
                            )
                              template(v-slot:activator="{ on, attrs }")
                                v-text-field.body-2(
                                  :value="evaluation.inputAt ? $dateFns.format(evaluation.inputAtToDate, 'yyyy.MM.dd') : null"
                                  placeholder="未入力"
                                  hide-details="auto"
                                  :flat="!evaluation.inputAtEditing"
                                  solo
                                  dense
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                )
                              v-date-picker(
                                v-model="evaluation.inputAt"
                                no-title
                                @input="updateEvaluation(evaluation, 'inputAt')"
                              )
                        .mt-3 {{ evaluation.description }}
                    v-card(
                      outlined
                      link
                    )
                      v-autocomplete.body-2.pa-3(
                        v-model="newEvaluation.recruiterId"
                        append-icon=""
                        :items="recruiterList"
                        item-text="nickname"
                        item-value="id"
                        placeholder="+ 面接官を追加"
                        flat
                        solo
                        dense
                        hide-details="auto"
                        :ref="`newEvaluation${history.id}`"
                        @input="createEvaluation(history.id, newEvaluation.recruiterId)"
                      )
                        template(v-slot:selection)
                          .grey--text + 面接官を追加
                        template(v-slot:item="{ item }")
                          v-avatar.me-1(
                            color="grey"
                            size="18"
                          )
                            span.white--text.subtitle-2 {{ item.nickname[0] }}
                          span.subtitle-2 {{ item.nickname }}
</template>

<script>
import Candidate from '@/models/Candidate'
import Channel from '@/models/Channel'
import Position from '@/models/Position'
import Recruiter from '@/models/Recruiter'
import RecruitmentHistory, { resultList } from '@/models/RecruitmentHistory'
import RecruitmentSelection from '@/models/RecruitmentSelection'
import RecruitmentEvaluation from '@/models/RecruitmentEvaluation'

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
      newEvaluation: {
        recruiterId: null,
      },
    }
  },
  methods: {
    openDialog(card) {
      this.currentCard = card
      this.dialog = true
    },
    async createAutoSchedulingToken(historyId) {
      const { data } = await this.$axios.post(
        `/recruitment_histories/${historyId}/auto_scheduling_token`
      )
      RecruitmentHistory.update({ data })

      // 表示中のカードの情報を洗い変える
      const card = Candidate.query().withAllRecursive().find(data.candidateId)
      this.currentCard = card
    },
    copyUrl(e) {
      navigator.clipboard.writeText(e.target.value)
      // コピーした旨の表示が出るように修正
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
      currentHistory[`${field}Editing`] = false
    },
    async createEvaluation(historyId, recruiterId) {
      const { data } = await this.$axios.post(
        `/recruitment_histories/${historyId}/recruitment_evaluations`,
        { evaluation: { recruiter_id: recruiterId } }
      )
      RecruitmentHistory.insert({ data, insert: ['recruitmentEvaluation'] })
      this.newEvaluation.recruiterId = null
      this.$nextTick(function () {
        this.$refs[`newEvaluation${historyId}`][0].blur()
      })

      // 表示中のカードの情報を洗い変える
      const card = Candidate.query().withAllRecursive().find(data.candidateId)
      this.currentCard = card
    },
    async updateEvaluation(currentEvaluation, field) {
      // 更新したフィールドのみ更新を走らせる
      const fieldSnakeCase = field.replace(
        /[A-Z]/g,
        (s) => '_' + s[0].toLowerCase()
      )
      let evaluation = {}
      evaluation[fieldSnakeCase] = currentEvaluation[field]
      const { data } = await this.$axios.put(
        `/recruitment_histories/${currentEvaluation.recruitmentHistoryId}/recruitment_evaluations/${currentEvaluation.id}`,
        { evaluation }
      )
      RecruitmentEvaluation.update({ data })
      currentEvaluation[`${field}Editing`] = false
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
.selected-at input
  text-align: right
</style>
