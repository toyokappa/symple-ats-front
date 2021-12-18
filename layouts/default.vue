<template lang="pug">
div
  .flex
    .fixed.inset-0.z-40.flex-none.h-full.w-full.bg-gray-100.text-sm.p-5(
      :class="'lg:h-screen lg:w-60 lg:block hidden'"
    )
      ul
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

<style lang="sass"></style>
