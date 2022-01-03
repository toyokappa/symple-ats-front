<template lang="pug">
v-card.py-16.mx-auto(
  flat
  max-width="480"
)
  .mb-4
    v-icon.d-block.text-center.mb-3(
      color="black"
      size="56"
    ) mdi-lock
    h1.text-center アカウント作成
    p.text-center.subtitle-2.mb-0 以下の情報を全て入力してください。
  v-form(
    @submit.prevent="signup"
    v-model="valid"
    lazy-validation
    ref="signupForm"
  )
    .mb-4
      v-text-field.body-2.mb-3(
        :value="`招待中のメールアドレス: ${invitation.email}`"
        dense
        outlined
        hide-details="auto"
        readonly
      )
      v-row(dense)
        v-col(cols="6")
          v-text-field.body-2.mb-3(
            v-model="recruiter.lastName"
            :rules="lastNameRules"
            autofocus
            dense
            outlined
            hide-details="auto"
            placeholder="姓"
          )
        v-col(cols="6")
          v-text-field.body-2.mb-3(
            v-model="recruiter.firstName"
            :rules="firstNameRules"
            dense
            outlined
            hide-details="auto"
            placeholder="名"
          )
      v-text-field.body-2.mb-3(
        v-model="recruiter.nickname"
        :rules="nicknameRules"
        dense
        outlined
        hide-details="auto"
        placeholder="アプリ内表示名"
      )
      v-text-field.body-2.mb-3(
        v-model="recruiter.password"
        :rules="passwordRules"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        dense
        outlined
        hide-details="auto"
        placeholder="パスワード"
        @click:append="showPassword = !showPassword"
      )
    .mb-4
      v-checkbox(
        v-model="recruiter.concent"
        :rules="concentRules"
        hide-details="auto"
      )
        template(v-slot:label)
          v-tooltip(bottom)
            template(v-slot:activator="{ on }")
              .subtitle-2 
                a(
                  target="_blank"
                  href="/"
                  @click.stop
                  v-on="on"
                ) 利用規約
                span に同意します。
            | 別ウィンドウで開きます
    .login-btn
      v-btn(
        type="submit"
        depressed
        block
      ) 上記の内容でアカウントを登録する
</template>

<script>
import {
  lastNameRules,
  firstNameRules,
  nicknameRules,
  passwordRules,
  concentRules,
} from '@/models/Recruiter'

export default {
  layout: 'auth',
  async asyncData({ $axios, params, redirect }) {
    const { organization_id: orgId, token } = params
    const { data } = await $axios.get(
      `/${orgId}/recruiter_invitations/${token}`
    )
    if (data.meta.recruiterExists) {
      return redirect(`/${orgId}/recruiter_invitations/${token}/authorize`)
    }
    return {
      invitation: data.invitation,
    }
  },
  data() {
    return {
      recruiter: {
        lastName: '',
        firstName: '',
        nickname: '',
        password: '',
        concent: false,
      },
      lastNameRules,
      firstNameRules,
      nicknameRules,
      passwordRules,
      concentRules,
      valid: true,
      showPassword: false,
    }
  },
  methods: {
    async signup() {
      await this.$refs.signupForm.validate()
      if (!this.valid) return

      try {
        await this.$axios.post('/auth', {
          name: `${this.recruiter.lastName} ${this.recruiter.firstName}`,
          nickname: this.recruiter.nickname,
          email: this.invitation.email,
          password: this.recruiter.password,
        })
        this.$router.push('/signin')
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>
