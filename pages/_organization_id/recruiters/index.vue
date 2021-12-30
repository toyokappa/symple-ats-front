<template lang="pug">
.px-8.py-4
  h2.mb-5 リクルーター管理

  //- 検索UI
  v-row(no-gutters).mb-2
    v-col(
      offset-md="4"
      md="8"
    )
      .d-flex.align-center
        v-text-field.body-2.me-3(
          v-model="searchKeyword"
          append-icon="mdi-magnify"
          placeholder="キーワードで絞り込む"
          dense
          hide-details
        )
        v-autocomplete.body-2.me-3(
          v-model="searchRole"
          :items="roleList"
          item-text="ja"
          item-value="en"
          placeholder="権限で絞り込む"
          dense
          hide-details
        )
        v-btn(
          small
          depressed
          height="32"
          @click.stop="createDialog = true"
        ) リクルーターを招待する

  //- 一覧UI
  v-data-table(
    :headers="headers"
    :items="allList"
    hide-default-footer
    item-key="email"
  )
    template(v-slot:item="{ item }")
      tr.cursor-pointer(@click.stop="openUpdateDialog(item)")
        td.text-start {{ item.nickname }}
        td.text-start {{ item.email }}
        td.text-start {{ item.roleJa }}
        td.text-start {{ item.level }}

  //- 招待UI
  v-dialog(
    v-model="createDialog"
    max-width="800"
  )
    v-card
      v-container
        v-card-title
          h3 リクルーター招待
        v-card-text
          v-form(
            v-model="valid.create"
            lazy-validation
            ref="createForm"
          )
            v-row(
              v-for="(addInvitation, index) in addInvitationList"
              :key="index"
              align="center"
              dense
            )
              v-col(cols="8")
                v-text-field.body-2(
                  v-model="addInvitation.email"
                  :rules="emailRules"
                  placeholder="招待先のメールアドレス"
                )
              v-col(cols="4")
                v-autocomplete.body-2(
                  v-model="addInvitation.role"
                  :rules="roleRules"
                  :items="roleList"
                  item-text="ja"
                  item-value="en"
                  placeholder="付与する権限"
                  append-outer-icon="mdi-delete"
                  @click:append-outer="remove"
                )
            .mb-3
              .d-flex.align-center.justify-space-between
                v-btn(
                  text
                  @click="add"
                )
                  v-icon mdi-expand-all
                  .ms-1 招待先を更に追加する
                v-btn(
                  depressed
                  @click="send"
                )
                  span 招待メールを送信する

  //- 編集UI（一旦後回し）
  template(v-if="currentRecruiter")
    v-dialog(
      v-model="updateDialog"
      max-width="800"
    )
      v-card
        v-container
          v-card-text
            .text-h5.font-weight-bold.mb-3 {{ currentRecruiter.nickname }}
            v-row(
              align="center"
              dense
            )
              v-col.grey--text(
                cols="2"
              ) メールアドレス
              v-col.px-5(
                cols="10"
              ) {{ currentRecruiter.email }}
            v-row(
              dense
            )
              v-col.py-2.grey--text(
                cols="2"
              ) 権限
              v-col.py-0(
                cols="10"
              )
                v-autocomplete.body-2(
                  v-model="currentRecruiter.role"
                  append-icon=""
                  :items="roleList"
                  item-text="ja"
                  item-value="en"
                  :flat="flat.role"
                  solo
                  dense
                  hide-details="auto"
                  @focus="flat.role = false"
                  @blur="flat.role= true"
                )
            v-row(
              align="center"
              dense
            )
              v-col.grey--text(
                cols="2"
              ) 利用練度
              v-col.px-5(
                cols="10"
              ) {{ currentRecruiter.level }}
</template>

<script>
import Recruiter, {
  roleList,
  nameRules,
  emailRules,
  roleRules,
} from '@/models/Recruiter'
import RecruiterInvitation from '@/models/RecruiterInvitation'

export default {
  layout: 'signedIn',
  async fetch({ $axios, $auth }) {
    const orgId = $auth.user.organization.uniqueId
    const { data: invitationList } = await $axios.get(
      `/${orgId}/recruiter_invitations`
    )
    RecruiterInvitation.insertOrUpdate({ data: invitationList })
    const { data: recruiterList } = await $axios.get(`/${orgId}/recruiters`)
    Recruiter.insertOrUpdate({ data: recruiterList })
  },
  data() {
    return {
      headers: [
        { text: '名前', value: 'nickname' },
        { text: 'メールアドレス', value: 'email' },
        { text: '権限', value: 'roleJa' },
        { text: '利用練度', value: 'level' },
      ],
      roleList,
      nameRules,
      emailRules,
      roleRules,
      valid: {
        create: true,
      },
      flat: {
        role: true,
      },
      searchKeyword: '',
      searchRole: '',
      createDialog: false,
      updateDialog: false,
      addInvitationList: [
        {
          email: '',
          role: '',
        },
      ],
      currentRecruiter: null,
    }
  },
  methods: {
    add() {
      const invitation = { email: '', role: '' }
      this.addInvitationList = [...this.addInvitationList, invitation]
    },
    remove(index) {
      this.addInvitationList.splice(index, 1)
    },
    async send() {
      if (this.addInvitationList.length === 0) return

      await this.$refs.createForm.validate()
      if (!this.valid.create) return

      const newInvitationList = await Promise.all(
        this.addInvitationList.map(async (invitation) => {
          const { data } = await this.$axios.post(
            `/${this.orgId}/recruiter_invitations`,
            {
              invitation: {
                email: invitation.email,
                role: invitation.role,
              },
            }
          )
          return data
        })
      )
      RecruiterInvitation.insert({ data: newInvitationList })

      this.addInvitationList = [{ email: '', role: '' }]
      this.createDialog = false
    },
    openUpdateDialog(recruiter) {
      this.currentRecruiter = recruiter
      this.updateDialog = true
    },
  },
  computed: {
    orgId() {
      return this.$auth.user.organization.uniqueId
    },
    invitationList() {
      return RecruiterInvitation.query()
        .where((invitation) => {
          return (
            invitation.email.indexOf(this.searchKeyword) !== -1 &&
            (invitation.role.indexOf(this.searchRole) !== -1 ||
              this.searchRole === null)
          )
        })
        .get()
    },
    recruiterList() {
      return Recruiter.query()
        .where((recruiter) => {
          return (
            (recruiter.nickname.indexOf(this.searchKeyword) !== -1 ||
              recruiter.email.indexOf(this.searchKeyword) !== -1) &&
            (recruiter.role.indexOf(this.searchRole) !== -1 ||
              this.searchRole === null)
          )
        })
        .get()
    },
    allList() {
      return this.invitationList.concat(this.recruiterList)
    },
  },
}
</script>

<style lang="sass"></style>
