<template lang="pug">
.container.mx-auto.py-8
  .text-2xl.font-bold.mb-5 リクルーター管理
  .flex.justify-end.mb-2
    input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="keyword")
    select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="authority" :class="dummyPlaceholder(authority)")
      option(value="" selected) 権限で絞り込む
      option(value="管理者") 管理者
      option(value="面接官") 面接官
      option(value="閲覧者") 閲覧者
    select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="level" :class="dummyPlaceholder(level)")
      option(:value="null" selected) 利用練度で絞り込む
      option(:value="1") Lv. 1
      option(:value="2") Lv. 2
      option(:value="3") Lv. 3
    button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(@click="$refs.invitationModal.openModal()") リクルーターを招待する
  table.w-full
    thead.text-sm.text-left.border-t.border-b.border-gray-200
      tr
        th.px-2.py-3 名前
        th.px-2.py-3 メールアドレス
        th.px-2.py-3 権限
        th.px-2.py-3 利用練度
    tbody.text-sm
      tr(v-for="recruiter in recruiterList" :key="recruiter.id")
        td.px-2.py-3
          parts-recruiter(v-if="recruiter.name" :recruiterId="recruiter.id")
          .text-sm.text-gray-400(v-else) 招待中...
        td.px-2.py-3 {{ recruiter.email }}
        td.px-2.py-3 {{ recruiter.authority }}
        td.px-2.py-3 Lv. {{ recruiter.level }}
  parts-modal(ref="invitationModal")
    .text-3xl.font-bold.mb-5 リクルーター招待
    .flex.mb-2(v-for="(invitation, index) in invitationList" :key="index")
      input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
        type="email"
        v-model="invitation.email"
        placeholder="招待先のメールアドレス"
      )
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(
        v-model="invitation.authority"
        :class="dummyPlaceholder(invitation.authority)"
      )
        option(value="" selected style="display: none") 付与する権限
        option(value="管理者") 管理者
        option(value="面接官") 面接官
        option(value="閲覧者") 閲覧者
      .text-sm.text-gray-300.border.border-gray-200.rounded.px-2.py-1.cursor-pointer(
        @click="removeInvitation(index)"
      ) ×
    .text-sm.text-gray-300.w-full.border.border-gray-200.rounded.px-2.py-1.cursor-pointer.mb-2(
      @click="addInvitation()"
    ) + 招待先を更に追加する
    .text-right
      button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(
        @click="sendInvitation()"
      ) 招待メールを送信する
</template>

<script>
import { recruiterList } from '@/fixtures'

export default {
  data() {
    return {
      recruiterList,
      keyword: '',
      authority: '',
      level: null,
      invitationList: [
        {
          email: '',
          authority: '',
        },
      ],
    }
  },
  methods: {
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
    addInvitation() {
      const invitation = { email: '', authority: '' }
      this.invitationList = [...this.invitationList, invitation]
    },
    removeInvitation(index) {
      this.invitationList.splice(index, 1)
    },
    sendInvitation() {
      if (this.invitationList.length === 0) return
      // TODO: バリデーションロジックは追加する

      const newRecruiters = this.invitationList.map((invitation, index) => {
        invitation.id = this.recruiterList.length + index + 1
        invitation.level = 1
        return invitation
      })
      // TODO: メールを飛ばすロジックを追加する
      this.recruiterList = this.recruiterList.concat(newRecruiters)
      this.invitationList = [{ email: '', authority: '' }]
      this.$refs.invitationModal.closeModal()
    }
  }
}
</script>

<style lang="sass">
.v-search-custom-style
  .vs__dropdown-toggle
    border-color: rgba(229, 231, 235, 1)
</style>
