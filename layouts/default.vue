<template lang="pug">
div
  .flex
    .fixed.inset-0.z-40.flex-none.h-full.w-full.bg-gray-100.text-sm.p-5(
      :class="'lg:h-screen lg:w-60 lg:block hidden'"
    )
      ul
        li.mb-3
          .relative(
            v-click-outside="closeDropdown"
          )
            button.flex.flex-row.items-center.w-full.text-sm.font-semibold.text-left(
              @click="open = !open"
            )
              span ああああ
              svg.inline.w-4.h-4.ml-1.transition-transform.dration-200.transform(
                fill="currentColor"
                viewBox="0 0 20 20"
                :class="{'rotate-180': open, 'rotate-0': !open}"
              )
                path(
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                )
          transition(name="fade")
            .absolute.left-4.w-full.mt-2.origin-top-right.rounded.shadow-lg(
              v-if="open"
            )
              .px-3.py-2.bg-white.rounded.shadow
                a.block.py-2.text-xs(href="#") プロフィール編集
                a.block.py-2.text-xs(@click.prevent="signout" href="#") ログアウト
        li.mb-3
          n-link(to="/") 採用進捗カンバン
        li.mb-3
          n-link(to="/analytics") 数値分析
        li.mb-3
          n-link(to="/recruiters") リクルーター管理
        li.mb-3
          n-link(to="/channels") チャネル管理
        li.mb-3
          n-link(to="/positions") ポジション管理
    .flex-auto(
      :class="'lg:max-h-full lg:ml-60'"
    )
      nuxt
</template>

<script>
export default {
  data() {
    return {
      open: false,
    }
  },
  methods: {
    closeDropdown() {
      this.open = false
    },
    async signout() {
      await this.$auth.logout()
      localStorage.removeItem('access-token')
      localStorage.removeItem('client')
      localStorage.removeItem('uid')
      localStorage.removeItem('token-type')
    },
  },
}
</script>

<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity 0.5s
.fade-enter, .fade-leave-to
  opacity: 0
</style>
