<template lang="pug">
.w-full
  .p-8
    .text-2xl.font-bold.mb-5 リクルーター管理

    //- 検索UI（一旦後回し）
    .flex.justify-end.mb-2
      input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="keyword")
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="role" :class="dummyPlaceholder(role)")
        option(:value="null" selected) 権限で絞り込む
        option(v-for="r in roles" :value="r.value" :key="r.value") {{ r.name }}
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="level" :class="dummyPlaceholder(level)")
        option(:value="null" selected) 利用練度で絞り込む
        option(v-for="lv in levels" :value="lv" :key="lv") Lv. {{ lv }}
      button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(@click="$refs.invitationModal.openModal()") リクルーターを招待する

    //- 一覧UI
    table.w-full
      thead.text-sm.text-left.border-t.border-b.border-gray-200
        tr
          parts-table-head-column 名前
          parts-table-head-column メールアドレス
          parts-table-head-column 権限
          parts-table-head-column 利用練度
      tbody.text-sm
        tr.cursor-pointer(
          v-for="recruiter in recruiterList"
          :key="recruiter.id"
          :class="'hover:bg-gray-100'"
          @click="openEditModal(recruiter)"
        )
          parts-table-body-column
            parts-recruiter(v-if="recruiter.nickname" :recruiter="recruiter")
            .text-sm.text-gray-400(v-else) 招待中...
          parts-table-body-column {{ recruiter.email }}
          parts-table-body-column {{ recruiter.role }}
          parts-table-body-column Lv. {{ recruiter.level }}

    //- 招待UI（一旦後回し）
    parts-modal(ref="invitationModal")
      .text-3xl.font-bold.mb-5 リクルーター招待
      .flex.mb-2(v-for="(invitation, index) in invitationList" :key="index")
        input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
          type="email"
          v-model="invitation.email"
          placeholder="招待先のメールアドレス"
        )
        select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(
          v-model="invitation.role"
          :class="dummyPlaceholder(invitation.role)"
        )
          option(:value="null" selected style="display: none") 付与する権限
          option(v-for="r in roles" :value="r.value" :key="r.value") {{ r.name }}
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

    //- 編集UI（一旦後回し）
    parts-modal(ref="recruiterEditModal")
      template(v-if="currentRecruiter")
        input.text-3xl.font-bold.outline-none.placeholder-gray-300.mb-5(
          type="text"
          v-model="currentRecruiter.name"
          placeholder="名前未入力"
          ref="nameField"
        )
        .grid.grid-cols-6.mb-2.items-center
          .text-sm メールアドレス
          .col-start-2.col-span-5
            .text-sm.px-2(:class="'py-0.5'") {{ currentRecruiter.email }}
        .grid.grid-cols-6.mb-2.items-center
          .text-sm 権限
          .col-start-2.col-span-5
            v-select.text-sm.text-gray-300(
              v-model="currentRecruiter.role"
              placeholder="未入力"
              :options="roles"
              :reduce="role => role.value"
              :class="'v-select-custom-style'"
            )
              template(#selected-option="option")
                .text-sm {{ option.label }}
              template(v-slot:option="option")
                .text-sm {{ option.label }}
        .grid.grid-cols-6.mb-2.items-center
          .text-sm 利用練度
          .col-start-2.col-span-5
            v-select.text-sm.text-gray-300(
              v-model="currentRecruiter.level"
              placeholder="未入力"
              :options="levels"
              :class="'v-select-custom-style'"
            )
              template(#selected-option="option")
                .text-sm Lv. {{ option.label }}
              template(v-slot:option="option")
                .text-sm Lv. {{ option.label }}
</template>

<script>
import { roles, levels } from '@/fixtures/recruiterList'

export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/recruiters')
    return {
      recruiterList: data
    }
  },
  data() {
    return {
      roles,
      levels,
      keyword: '',
      role: null,
      level: null,
      invitationList: [
        {
          email: '',
          role: null,
        },
      ],
      currentRecruiter: null,
    }
  },
  methods: {
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
    addInvitation() {
      const invitation = { email: '', role: '' }
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
      this.invitationList = [{ email: '', role: null }]
      this.$refs.invitationModal.closeModal()
    },
    openEditModal(recruiter) {
      this.currentRecruiter = recruiter
      this.$refs.recruiterEditModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    }
  }
}
</script>

<style lang="sass">
</style>
