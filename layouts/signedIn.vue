<template lang="pug">
div
  .flex
    .fixed.inset-0.z-40.flex-none.h-full.w-full.bg-gray-100.text-sm.py-5(
      :class="'lg:h-screen lg:w-60 lg:block hidden'"
    )
      ul.px-5
        li.mb-3
          n-link(:to="`/${orgId}`") 採用進捗カンバン
        li.mb-3
          n-link(:to="`/${orgId}/analytics`") 数値分析
        li.mb-3
          n-link(:to="`/${orgId}/recruiters`") リクルーター管理
        li.mb-3
          n-link(:to="`/${orgId}/channels`") チャネル管理
        li.mb-3
          n-link(:to="`/${orgId}/positions`") ポジション管理
      .fixed.bottom-0.w-60.p-5.border-t.border-gray-300
        .relative(
          v-click-outside="closeDropdown"
        )
          button.flex.flex-row.w-full.text-sm.text-left(
            @click="open = !open"
          )
            div(v-if="$auth.user")
              .font-semibold {{ $auth.user.organization.name }}
              .text-gray-500 {{ $auth.user.nickname }}
            svg.inline.w-4.h-4.mt-1.ml-1.transition-transform.dration-200.transform(
              fill="currentColor"
              viewBox="0 0 20 20"
              :class="{'rotate-0': open, 'rotate-180': !open}"
            )
              path(
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              )
        transition(name="fade")
          .absolute.left-4.bottom-16.w-full.mb-2.origin-top-right.rounded.shadow(
            v-if="open"
          )
            .px-3.py-3.bg-white.rounded.shadow
              .text-gray-500.text-xs.px-2.pt-2.pb-1(v-if="$auth.user.organizations.length > 1") 組織を選択
              a.flex.items-center.justify-between.px-2.py-2.text-sm.font-bold.rounded(
                v-for="org in $auth.user.organizations"
                :href="`/${org.uniqueId}`"
                :key="org.id"
                :class="'hover:bg-gray-100'"
              )
                span {{ org.name }}
                span(v-if="org.uniqueId === orgId")
                  svg.w-4.h-4(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24")
                    path(d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z")
              .my-2.border-t.border-gray-300
              a.block.px-2.py-2.text-xs.rounded(href="#" :class="'hover:bg-gray-100'") プロフィール編集
              button.block.w-full.text-left.px-2.py-2.text-xs.rounded(@click.prevent="signout" :class="'hover:bg-gray-100'") ログアウト
    .flex-auto(
      :class="'lg:max-h-full lg:ml-60'"
    )
      nuxt
</template>

<script>
export default {
  middleware: ['checkOrganization'],
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
  computed: {
    orgId() {
      return this.$route.params.organization_id
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
