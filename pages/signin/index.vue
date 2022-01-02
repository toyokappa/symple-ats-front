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
    h1.text-center ログイン
    p.text-center.subtitle-2.mb-0 もしくは 
      a 利用を申請する
  v-form(@submit.prevent="signin")
    .mb-4
      v-text-field.body-2.mb-3(
        v-model="recruiter.email"
        type="email"
        autofocus
        dense
        outlined
        hide-details="auto"
        placeholder="メールアドレス"
      )
      v-text-field.body-2.mb-3(
        v-model="recruiter.password"
        type="password"
        dense
        outlined
        hide-details="auto"
        placeholder="パスワード"
      )
    .mb-4
      a.d-block.text-right.subtitle-2 パスワードを忘れた場合
    .login-btn
      v-btn(
        type="submit"
        depressed
        block
      ) ログイン
</template>

<script>
export default {
  layout: 'auth',
  middleware: ['auth'],
  data() {
    return {
      recruiter: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async signin() {
      try {
        await this.$auth.loginWith('local', {
          data: this.recruiter,
        })
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>
