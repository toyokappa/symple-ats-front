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
            .d-flex
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
              v-menu(
                offset-y
                left
              )
                template(v-slot:activator="{ on, attrs }")
                  v-btn(
                    icon
                    tile
                    v-bind="attrs"
                    v-on="on"
                  )
                    v-icon mdi-dots-vertical
                v-list(dense)
                  v-list-item(
                    link
                    @click="deleteCandidate"
                  )
                    v-list-item-title 候補者を削除
            v-container
              v-row(dense)
                v-col.py-2.grey--text(cols="2") 選考状況
                v-col.py-0(cols="10")
                  v-autocomplete.body-2(
                    v-model="currentCard.recruitmentSelectionId"
                    append-icon=""
                    :items="selectionList"
                    item-text="name"
                    item-value="id"
                    :flat="!currentCard.recruitmentSelectionIdEditing"
                    solo
                    dense
                    hide-details="auto"
                    @focus="currentCard.recruitmentSelectionIdEditing = true"
                    @blur="currentCard.recruitmentSelectionIdEditing = false"
                    @input="update('recruitmentSelectionId')"
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
              v-row(dense)
                v-col.py-2.grey--text(cols="2") 採用担当
                v-col.py-0(cols="10")
                  v-autocomplete.body-2(
                    v-model="currentCard.recruiterId"
                    append-icon=""
                    :items="recruiterList"
                    item-text="nickname"
                    item-value="id"
                    :flat="!currentCard.recruiterIdEditing"
                    solo
                    dense
                    hide-details="auto"
                    @focus="currentCard.recruiterIdEditing = true"
                    @blur="currentCard.recruiterIdEditing = false"
                    @input="update('recruiterId')"
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
                v-col.py-2.grey--text(cols="2") 応募経路
                v-col.py-0(cols="10")
                  v-autocomplete.body-2(
                    v-model="currentCard.channelId"
                    append-icon=""
                    :items="channelList"
                    item-text="name"
                    item-value="id"
                    :flat="!currentCard.channelIdEditing"
                    solo
                    dense
                    hide-details="auto"
                    @focus="currentCard.channelIdEditing = true"
                    @blur="currentCard.channelIdEditing = false"
                    @input="update('channelId')"
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
              v-row(dense)
                v-col.py-2.grey--text(cols="2") ポジション
                v-col.py-0(cols="10")
                  v-autocomplete.body-2(
                    v-model="currentCard.positionId"
                    append-icon=""
                    :items="positionList"
                    item-text="internalName"
                    item-value="id"
                    :flat="!currentCard.positionIdEditing"
                    solo
                    dense
                    hide-details="auto"
                    @focus="currentCard.positionIdEditing = true"
                    @blur="currentCard.positionIdEditing = false"
                    @input="update('positionId')"
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
              v-row(dense)
                v-col.py-2.grey--text(cols="2") レジュメ
                v-col.py-0(cols="10")
                  input.d-none(
                    type="file"
                    multiple
                    ref="resumeInput"
                    @change="uploadResumes"
                  )
                  v-menu(
                    offset-y
                    tile
                    :close-on-content-click="false"
                  )
                    template(v-slot:activator="{ on, attrs }")
                      v-list-item.body-2(
                        placeholder="未登録"
                        dense
                        v-bind="attrs"
                        v-on="on"
                      )
                        template(v-if="currentCard.resumeFiles.length > 0")
                          v-chip.me-2(
                            v-for="file in currentCard.resumeFiles"
                            :key="file.url"
                            label
                            small
                          ) {{ file.name }}
                        template(v-else)
                          v-list-item-content
                            v-list-item-title.grey--text 未登録
                    v-list.py-0(dense)
                      template(v-if="currentCard.resumeFiles.length > 0")
                        .py-2
                          v-list-item(
                            v-for="file in currentCard.resumeFiles"
                            :key="file.url"
                          )
                            v-chip(
                              label
                              close
                              link
                              :href="file.url"
                              target="_blank"
                              @click:close="deleteResume(file.id)"
                            ) {{ file.name }}
                        v-divider
                      v-list-item(
                        link
                        @click="$refs.resumeInput.click()"
                      )
                        v-list-item-content
                          v-list-item-title + ファイルを追加する
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
                        template(v-if="!history.autoSchedulingToken")
                          template(v-if="history.recruitersAllGoogleAuthenticated")
                            v-btn(
                              block
                              outlined
                              dense
                              @click="createAutoSchedulingToken(history.id)"
                            ) 日程の自動調整を行う
                          template(v-else)
                            v-tooltip(
                              :disabled="history.recruitersAllGoogleAuthenticated"
                              bottom
                            )
                              template(v-slot:activator="{ on, attrs }")
                                v-btn(
                                  color="grey"
                                  block
                                  outlined
                                  dense
                                  :ripple="false"
                                  v-bind="attrs"
                                  v-on="on"
                                ) 日程の自動調整を行う
                              span 自動調整を行うには選考官がGoogle連携済みである必要があります。
                        template(v-else)
                          v-text-field.caption(
                            :value="history.autoSchedulingUrl(orgId)"
                            readonly
                            append-icon="mdi-close-circle"
                            outlined
                            dense
                            hide-details="auto"
                            @click="copyUrl(history.autoSchedulingUrl(orgId))"
                            @click:append="deleteAutoSchedulingToken(history.id)"
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
                    v-card(
                      v-for="(evaluation, index) in history.recruitmentEvaluations"
                      :class="{ 'mt-3': (index > 0) }"
                      :key="evaluation.id"
                    )
                      v-container.pa-5
                        .d-flex
                          .flex-grow-1
                            v-row(dense)
                              v-col.py-2.grey--text(cols="2") 選考官
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
                                    v-tooltip(
                                      v-if="item.googleAuthenticated"
                                      bottom
                                    )
                                      template(v-slot:activator="{ on, attrs }")
                                        v-icon.ms-1(
                                          color="success"
                                          dense
                                          v-bind="attrs"
                                          v-on="on"
                                        ) mdi-check-decagram
                                      span.caption Google連携済み
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
                                    @focus="evaluation.inputAtEditing = true"
                                    @input="updateEvaluation(evaluation, 'inputAt')"
                                  )
                          v-menu(
                            offset-y
                            left
                          )
                            template(v-slot:activator="{ on, attrs }")
                              v-btn(
                                icon
                                tile
                                v-bind="attrs"
                                v-on="on"
                              )
                                v-icon mdi-dots-vertical
                            v-list(dense)
                              v-list-item(
                                link
                                @click="deleteEvaluation(evaluation)"
                              )
                                v-list-item-title 選考評価を削除
                        .mt-3 {{ evaluation.description }}
                    v-card(
                      v-if="(!history.result || !history.selectedAt) && !history.autoSchedulingToken"
                      outlined
                      link
                      :class="{ 'mt-3': history.recruitmentEvaluations.length > 0 }"
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
  v-snackbar(v-model="snackbar") クリップボードにコピーしました。
    template(v-slot:action="{ attrs }")
      v-btn(
        color="red"
        text
        v-bind="attrs"
        @click="snackbar = false"
      ) 閉じる
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
      snackbar: false,
      currentCard: null,
      resultList,
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
      this.refreshCurrentCard()
    },
    async deleteAutoSchedulingToken(historyId) {
      const isDelete = await confirm(
        '自動スケジュール調整URLを削除してよろしいですか？'
      )
      if (!isDelete) return

      const { data } = await this.$axios.delete(
        `/recruitment_histories/${historyId}/auto_scheduling_token`
      )
      RecruitmentHistory.update({ data })
      this.refreshCurrentCard()
    },
    copyUrl(url) {
      navigator.clipboard.writeText(url)
      this.snackbar = true
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
      this.currentCard[`${field}Editing`] = false
    },
    async deleteCandidate() {
      const isDelete = await confirm('本当に削除してよろしいですか？')
      if (!isDelete) return

      const { data } = await this.$axios.delete(
        `/candidates/${this.currentCard.id}`
      )
      this.dialog = false
      Candidate.delete(data.id)
    },
    async uploadResumes(e) {
      const files = e.target.files || e.dataTransfer.files
      let params = new FormData()
      Array.from(files).forEach((file) => {
        params.append(`resume[files][]`, file)
      })
      const { data } = await this.$axios.post(
        `/candidates/${this.currentCard.id}/resumes`,
        params,
        { 'Content-Type': 'multipart/form-data' }
      )
      Candidate.update({ data })
      this.refreshCurrentCard()
    },
    async deleteResume(id) {
      const { data } = await this.$axios.delete(
        `/candidates/${this.currentCard.id}/resumes/${id}`
      )
      Candidate.update({ data })
      this.refreshCurrentCard()
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
      this.refreshCurrentCard()
    },
    async createEvaluation(historyId, recruiterId) {
      const { data } = await this.$axios.post(
        `/recruitment_histories/${historyId}/recruitment_evaluations`,
        { evaluation: { recruiter_id: recruiterId } }
      )
      RecruitmentEvaluation.insert({ data })
      this.newEvaluation.recruiterId = null
      this.$nextTick(function () {
        this.$refs[`newEvaluation${historyId}`][0].blur()
      })
      this.refreshCurrentCard()
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
      this.refreshCurrentCard()
    },
    async deleteEvaluation(currentEvaluation) {
      const isDelete = await confirm('本当に削除してよろしいですか？')
      if (!isDelete) return

      const { data } = await this.$axios.delete(
        `/recruitment_histories/${currentEvaluation.recruitmentHistoryId}/recruitment_evaluations/${currentEvaluation.id}`
      )
      RecruitmentEvaluation.delete(data.id)
      this.refreshCurrentCard()
    },
    refreshCurrentCard() {
      // 表示中のカードの情報を洗い変える
      const card = Candidate.query()
        .withAllRecursive()
        .find(this.currentCard.id)
      this.currentCard = card
    },
  },
  computed: {
    orgId() {
      return this.$route.params.organization_id
    },
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
