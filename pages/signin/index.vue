<template lang="pug">
.min-h-full.flex.items-center.justify-center.py-12.px-4
  .max-w-md.w-full.space-y-8
    div
      h2.text-center.text-3xl.font-extrabold ログイン
      p.mt-2.text-center.text-sm.text-gray-600 もしくは 
        a.font-medium.text-indigo-600(href="#") 利用を申請する
    form.mt-8.space-y-6(@submit.prevent="signin")
      input(type="hidden" name="remember" value="true")
      .rounded.shadow-sm.-space-y-px
        div
          label.sr-only(for="email")
          input#email.apperrance-none.rounded-none.relative.block.w-full.px-3.py-2.border.border-gray-300.placeholder-gray-300.rounded-t(
            v-model="recruiter.email"
            type="email"
            name="email"
            autocomplete="email"
            required
            placeholder="メールアドレス"
          )
        div
          label.sr-only(for="password")
          input#password.apperance-none.rounded-none.relative.block.w-full.px-3.py-2.border.border-gray-300.placeholder-gray-300.rounded-b(
            v-model="recruiter.password"
            type="password"
            name="password"
            autocomplete="password"
            required
            placeholder="パスワード"
          )
      .flex.items-center.justify-between
        .flex.items-center
          input#remember-me.h-4.w-4.text-indigo-600.border-gray-300.rounded(
            type="checkbox"
            name="remember-me"
          )
          label.ml-2.block.text-sm(for="remember-me") ログイン状態を保存する
        .text-sm
          a.font-medium.text-indigo-600(href="#") パスワードを忘れた方
      div
        button.group.lelative.w-full.flex.justify-center.py-2.px-4.border.border-transparent.text-sm.font-medium.rounded.text-white.bg-indigo-600(
          type="submit"
        ) ログイン
</template>

<script>
export default {
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
