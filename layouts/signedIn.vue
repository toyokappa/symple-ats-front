<template lang="pug">
v-app
  v-navigation-drawer(app)
    v-layout(
      fill-height
      column
    )
      v-list.mb-auto(dense)
        v-list-item(
          v-for="nav in navigation"
          :key="nav.title"
          link
          nuxt
          :to="`/${orgId}${nav.link}`"
          exact-path
        )
          v-list-item-icon.me-2
            v-icon(dense) {{ nav.icon }}
          v-list-item-content
            v-list-item-title {{ nav.title }}
      v-divider
      v-list(dense)
        v-menu(
          offset-y
          top
        )
          template(v-slot:activator="{ on, attrs }")
            v-list-item(
              link
              v-bind="attrs"
              v-on="on"
            )
              v-list-item-content
                v-list-item-title.font-weight-bold {{ $auth.user.organization.name }}
                v-list-item-subtitle {{ $auth.user.nickname }}
          v-list(dense)
            v-list-item(
              v-for="org in $auth.user.organizations"
              :key="org.uniqueId"
              link
              :href="`/${org.uniqueId}`"
            )
              v-list-item-content
                v-list-item-title.font-weight-bold {{ org.name }}
              v-list-item-icon(v-if="org.uniqueId === orgId")
                v-icon(dense) mdi-check-bold
            v-divider.my-2
            v-list-item(link)
              v-list-item-content
                v-list-item-subtitle プロフィール編集
            v-list-item(
              link
              @click.prevent="signout"
            )
              v-list-item-content
                v-list-item-subtitle ログアウト
  v-main
    v-container(fluid)
      nuxt
</template>

<script>
export default {
  middleware: ['checkOrganization'],
  data() {
    return {
      navigation: [
        { title: '採用カンバン', link: '', icon: 'mdi-card-bulleted' },
        {
          title: '数値分析',
          link: '/analytics',
          icon: 'mdi-chart-areaspline-variant',
        },
        {
          title: 'リクルーター管理',
          link: '/recruiters',
          icon: 'mdi-account-multiple',
        },
        { title: 'チャネル管理', link: '/channels', icon: 'mdi-bullhorn' },
        {
          title: 'ポジション管理',
          link: '/positions',
          icon: 'mdi-file-document-multiple',
        },
      ],
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

<style lang="sass" scoped></style>
