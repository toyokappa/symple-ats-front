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
  v-form(@submit.prevent="signup")
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
            autofocus
            dense
            outlined
            hide-details="auto"
            placeholder="姓"
          )
        v-col(cols="6")
          v-text-field.body-2.mb-3(
            v-model="recruiter.firstName"
            dense
            outlined
            hide-details="auto"
            placeholder="名"
          )
      v-text-field.body-2.mb-3(
        v-model="recruiter.nickname"
        dense
        outlined
        hide-details="auto"
        placeholder="アプリ内表示名"
      )
      v-text-field.body-2.mb-3(
        v-model="recruiter.password"
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
// ロジック整理
// 1. トークンをもとに招待情報にアクセス
// 2-1. 招待状が存在する場合
// 2-1-1. すでに登録アカウントが存在する場合
// 2-1-1-1. 招待承認処理の実行
// 2-1-1-2. 招待先の組織のトップページへリダイレクト
// 2-1-2. 登録アカウントが存在しない場合
// 2-1-2-1. アカウント登録ページが表示される
// 2-1-2-2. アカウント登録が完了
// 2-1-2-3. 該当アカウントでログイン
// 2-1-2-4. 招待承認処理の実行
// 2-1-2-5. 招待先の組織のトップページへリダイレクト
// 2-2. 招待状が存在しない場合
// 2-2-1. 404ページが表示される
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
        firstName: '',
        lastName: '',
        nickname: '',
        password: '',
        concent: false,
      },
      showPassword: false,
    }
  },
  methods: {
    async signup() {
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
