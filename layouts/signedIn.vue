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
            v-list-item(
              link
              @click.stop="profileDialog = true"
            )
              v-list-item-content
                v-list-item-subtitle プロフィール編集
            v-list-item(
              link
              @click.prevent="signout"
            )
              v-list-item-content
                v-list-item-subtitle ログアウト
  v-main.overflow-x-auto
    v-container(fluid)
      nuxt
  v-dialog(
    v-if="currentRecruiter"
    v-model="profileDialog"
    max-width="800"
  )
    v-card
      v-container
        v-card-text
          .text-h5.font-weight-bold.mb-2 プロフィール編集
          .d-flex.align-center.mb-5
            v-icon.grey--text(size="16") mdi-help-circle-outline
            .caption.ms-1.grey--text プロフィールの変更は、すべての組織に適用されます。
          .body-1.font-weight-bold.mb-3 個人情報
          v-row.mb-3
            v-col(cols="6")
              .grey--text.mb-1 フルネーム
              v-text-field(
                v-model="currentRecruiter.name"
                placeholder="名前"
                dense
                outlined
                hide-details="auto"
              )
            v-col(cols="6")
              .grey--text.mb-1 システム内で表示する名前
              v-text-field(
                v-model="currentRecruiter.nickname"
                placeholder="名前"
                dense
                outlined
                hide-details="auto"
              )
          .grey--text.mb-1 メールアドレス
          .d-flex.align-center
            .body-1.me-3 {{ currentRecruiter.email }}
            .caption.grey--text メールアドレスを変更する
          v-divider.my-5
          .body-1.font-weight-bold.mb-2 組織内権限
          template(v-if="currentRecruiter.role === 'admin'")
            .caption.grey--text.mb-3 組織内権限はプロフィールから変更ができません。リクルーター管理ページより変更を行ってください。
          template(v-else)
            .caption.grey--text.mb-3 組織内権限はプロフィールから変更ができません。管理者権限を持つ社内メンバーへ変更の依頼を行ってください。
          v-text-field(
            :value="currentRecruiter.roleJa"
            dense
            outlined
            readonly
            hide-details
          )
          v-divider.my-5
          .body-1.font-weight-bold.mb-2 Googleカレンダー連携
          .caption.grey--text.mb-3 Googleカレンダーと連携することにより、面接日程の自動設定機能を利用することができます。なお、複数人が出席する面接の自動設定を行う場合は、出席する面接官全員がGoogleカレンダーと連携している必要があります。
          template(v-if="currentRecruiter.googleAuthenticated")
            .d-flex.align-center.mb-3
              v-icon.green--text.me-1 mdi-check-bold
              .body-1.green--text.pt-1.me-3 Googleカレンダーと連携済み
              v-btn(
                outlined
                dense
                link
                href="http://localhost:7700/auth/google_oauth2"
              )
                v-icon(dense) mdi-google
                span.ms-1 再連携する
            .d-flex.align-center
              .grey--text.me-3 連携中アカウント:
              .body-1.me-3 {{ currentRecruiter.googleOauth2Email }}
          template(v-else)
            v-btn(
              outlined
              link
              href="http://localhost:7700/auth/google_oauth2"
            )
              v-icon(dense) mdi-google
              span.ms-1 Googleカレンダーを連携する
          v-divider.my-5
          .body-1.font-weight-bold.mb-3 パスワード
          v-btn(
            outlined
          ) パスワードを変更する
</template>

<script>
import Recruiter from '@/models/Recruiter'

export default {
  name: 'signedIn',
  middleware: ['auth', 'checkOrganization'],
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
      profileDialog: false,
    }
  },
  methods: {
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
    currentRecruiter() {
      return Recruiter.find(this.$auth.user.id)
    },
  },
}
</script>

<style lang="sass" scoped></style>
