<template lang="pug">
v-card.pt-8.pb-16.mx-auto(
  max-width="480"
  flat
)
  v-form
    v-card-text
      .text-h5.font-weight-bold.mb-5 候補者推薦フォーム
      .text-h6.font-weight-bold.mb-2 候補者情報
      .grey--text.mb-1 候補者の氏名
      v-row(dense).mb-3
        v-col(cols="6")
          v-text-field.body-2(
            v-model="applyForm.candidateLastName"
            dense
            outlined
            hide-details="auto"
            placeholder="姓"
          )
        v-col(cols="6")
          v-text-field.body-2(
            v-model="applyForm.candidateFirstName"
            dense
            outlined
            hide-details="auto"
            placeholder="名"
          )
      .grey--text.mb-1 応募ポジション
      v-autocomplete.body-2.mb-3(
        v-model="applyForm.positionId"
        :items="positionList"
        item-text="externalName"
        item-value="id"
        dense
        outlined
        hide-details="auto"
        placeholder="未選択"
      )
      .grey--text.mb-1 レジュメ
      v-file-input.body-2.mb-3(
        v-model="applyForm.resumes"
        dense
        outlined
        multiple
        small-chips
        show-size
        hide-details="auto"
        placeholder="未入力"
      )
      .grey--text.mb-1 推薦文
      v-textarea.body-2(
        v-model="applyForm.description"
        dense
        outlined
        hide-details="auto"
        placeholder="任意"
      )
      v-divider.my-5
      .text-h6.font-weight-bold 紹介者情報
      .caption.grey--text.mb-3 入力いただいた内容は一定期間保存されます。
      .grey--text.mb-1 紹介者の所属
      v-text-field.body-2.mb-1(
        :value="channel.name"
        dense
        outlined
        readonly
        hide-details="auto"
      )
      .caption.grey--text.mb-3 所属名が異なる場合は担当企業の採用担当者へご連絡ください。
      .grey--text.mb-1 紹介者の氏名
      v-row(dense).mb-3
        v-col(cols="6")
          v-text-field.body-2(
            v-model="applyForm.agentLastName"
            dense
            outlined
            hide-details="auto"
            placeholder="姓"
          )
        v-col(cols="6")
          v-text-field.body-2(
            v-model="applyForm.agentFirstName"
            dense
            outlined
            hide-details="auto"
            placeholder="名"
          )
      .grey--text.mb-1 紹介者のメールアドレス
      v-text-field.body-2.mb-5(
        v-model="applyForm.agentEmail"
        type="email"
        dense
        outlined
        hide-details="auto"
      )
      v-btn(
        block
        color="primary"
        dense
        @click="apply"
      ) 候補者を推薦する
</template>

<script>
import Position from '@/models/Position'
import Channel from '@/models/Channel'

export default {
  async fetch({ params, $axios }) {
    const orgId = params.organization_id
    const { data: positionList } = await $axios.get(`/${orgId}/positions`)
    const { data: channel } = await $axios.get(
      `/${orgId}/applies/${params.token}`
    )
    Position.insertOrUpdate({ data: positionList })
    Channel.insertOrUpdate({ data: channel })
  },
  data() {
    return {
      applyForm: {
        candidateFirstName: '',
        candidateLastName: '',
        positionId: null,
        resumes: null,
        description: '',
        agentFirstName: '',
        agentLastName: '',
        agentEmail: '',
      },
    }
  },
  methods: {
    async apply() {
      const orgId = this.$route.params.organization_id
      this.$axios.post(`/${orgId}/applies`, this.applyParams, {
        'Content-Type': 'multipart/form-data',
      })
      localStorage.setItem('agentFirstName', this.applyForm.agentFirstName)
      localStorage.setItem('agentLastName', this.applyForm.agentLastName)
      localStorage.setItem('agentEmail', this.applyForm.agentEmail)
      this.applyForm.candidateFirstName = ''
      this.applyForm.candidateLastName = ''
      this.applyForm.positionId = null
      this.applyForm.resumes = null
      this.applyForm.description = ''
    },
  },
  mounted() {
    this.applyForm.agentFirstName = localStorage.getItem('agentFirstName')
    this.applyForm.agentLastName = localStorage.getItem('agentLastName')
    this.applyForm.agentEmail = localStorage.getItem('agentEmail')
  },
  computed: {
    positionList() {
      return Position.all()
    },
    channel() {
      return Channel.query().first()
    },
    applyParams() {
      const params = new FormData()
      const {
        candidateFirstName,
        candidateLastName,
        positionId,
        resumes,
        description,
        agentFirstName,
        agentLastName,
        agentEmail,
      } = this.applyForm
      params.append(
        'candidate[name]',
        `${candidateLastName} ${candidateFirstName}`
      )
      params.append('candidate[position_id]', positionId)
      params.append('candidate[channel_id]', this.channel.id)
      resumes.forEach((file) => {
        params.append('candidate[resumes][]', file)
      })
      params.append(
        'candidate[agent_name]',
        `${agentLastName} ${agentFirstName}`
      )
      params.append('candidate[agent_email]', agentEmail)
      params.append('candidate[description]', description)
      return params
    },
  },
}
</script>
