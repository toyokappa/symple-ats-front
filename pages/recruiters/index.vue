<template lang="pug">
.container.mx-auto.py-8
  .text-2xl.font-bold.mb-10 リクルーター管理
  .flex.justify-end.pb-2
    input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="keyword")
    select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="authorty")
      option(value="管理者") 管理者
      option(value="面接官") 面接官
      option(value="閲覧者") 閲覧者
    select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="level")
      option(:value="1") Lv. 1
      option(:value="2") Lv. 2
      option(:value="3") Lv. 3
    button.text-sm.text-gray-400.bg-gray-200.border.rounded.px-2.py-1 リクルーターを招待
  table.w-full
    thead.text-sm.text-left.border-t.border-b.border-gray-200
      tr
        th.px-2.py-3 名前
        th.px-2.py-3 メールアドレス
        th.px-2.py-3 権限
        th.px-2.py-3 利用練度
    tbody.text-sm
      tr(v-for="recruiter in recruiterList" :key="recruiter.id")
        td.px-2.py-3
          parts-recruiter(:recruiterId="recruiter.id")
        td.px-2.py-3 {{ recruiter.email }}
        td.px-2.py-3 {{ recruiter.authority }}
        td.px-2.py-3 Lv. {{ recruiter.level }}
</template>

<script>
import { recruiterList } from '@/fixtures'

export default {
  data() {
    return {
      recruiterList,
      keyword: '',
      authority: '',
      level: null,
    }
  }
}
</script>

<style lang="sass">
.v-search-custom-style
  .vs__dropdown-toggle
    border-color: rgba(229, 231, 235, 1)
</style>
