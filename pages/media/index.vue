<template lang="pug">
.w-full
  .p-8
    .text-2xl.font-bold.mb-5 媒体管理
    .flex.justify-end.mb-2
      input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="keyword")
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="category" :class="dummyPlaceholder(category)")
        option(:value="null" selected) 媒体種別で絞り込む
        option(v-for="cat in categories" :value="cat.id" :key="cat.id") {{ cat.name }}
      button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(@click="$refs.addMediaModal.openModal()") 媒体を追加する
    table.w-full
      thead.text-sm.text-left.border-t.border-b.border-gray-200
        tr
          th.px-2.py-3 媒体名
          th.px-2.py-3 媒体種別
          th.px-2.py-3 自動起票
          th.px-2.py-3 応募URL
      tbody.text-sm
        tr.cursor-pointer(
          v-for="media in mediaList"
          :key="media.id"
          :class="'hover:bg-gray-100'"
          @click="openEditModal(media)"
        )
          td.px-2.py-3
            template(v-if="media.name") {{ media.name }}
            .text-gray-400(v-else) 未入力
          td.px-2.py-3
            .inline-block.text-xs.text-black.rounded.px-2(
              :class="`bg-${findCategory(media.categoryId).color}-100 py-0.5`"
            ) {{ findCategory(media.categoryId).name }}
          td.px-2.py-3 {{ media.automation }}
          td.px-2.py-3
            template(v-if="media.applicationPath") https://symple.com{{ media.applicationPath }}
            template(v-else) -
    parts-modal(ref="addMediaModal")
      .text-3xl.font-bold.mb-5 媒体追加
      .flex.mb-2(v-for="(addMedia, index) in addMediaList" :key="index")
        input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
          type="text"
          v-model="addMedia.name"
          placeholder="媒体名"
        )
        select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(
          v-model="addMedia.categoryId"
          :class="dummyPlaceholder(addMedia.categoryId)"
        )
          option(:value="null" selected style="display: none") メディア種別
          option(v-for="cat in categories" :value="cat.id" :key="cat.id") {{ cat.name }}
        .text-sm.text-gray-300.border.border-gray-200.rounded.px-2.py-1.cursor-pointer(
          @click="removeMedia(index)"
        ) ×
      .text-sm.text-gray-300.w-full.border.border-gray-200.rounded.px-2.py-1.cursor-pointer.mb-2(
        @click="addMedia()"
      ) + 媒体を更に追加する
      .text-right
        button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(
          @click="submitMedia()"
        ) 媒体の追加を確定する
    parts-modal(ref="mediaEditModal")
      template(v-if="currentMedia")
        input.text-3xl.font-bold.outline-none.placeholder-gray-300.mb-5(
          type="text"
          v-model="currentMedia.name"
          placeholder="名前未入力"
          ref="nameField"
        )
        .grid.grid-cols-6.mb-2.items-center
          .text-sm 媒体種別
          .col-start-2.col-span-5
            v-select.text-sm.text-gray-300(
              v-model="currentMedia.categoryId"
              placeholder="未入力"
              :options="categories"
              :reduce="category => category.id"
              label="name"
              :class="'v-select-custom-style'"
            )
              template(#selected-option="option")
                .inline-block.text-xs.text-black.rounded.px-2(
                  :class="`bg-${option.color}-100 py-0.5`"
                ) {{ option.name }}
              template(v-slot:option="option")
                .inline-block.text-xs.text-black.rounded.px-2(
                  :class="`bg-${option.color}-100 py-0.5`"
                ) {{ option.name }}
</template>

<script>
import { mediaList } from '@/fixtures'
import { categories } from '@/fixtures/mediaList'

export default {
  data() {
    return {
      mediaList,
      categories,
      keyword: '',
      category: null,
      addMediaList: [
        {
          name: '',
          categoryId: null,
        },
      ],
      currentMedia: null,
    }
  },
  methods: {
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
    addMedia() {
      const media = { name: '', categoryId: null }
      this.addMediaList = [...this.addMediaList, media]
    },
    removeMedia(index) {
      this.addMediaList.splice(index, 1)
    },
    submitMedia() {
      if (this.addMediaList.length === 0) return
      // TODO: バリデーションロジックは追加する

      const newMediaList = this.addMediaList.map((media, index) => {
        media.id = this.mediaList.length + index + 1
        media.automation = '未設定'
        return media
      })
      this.mediaList = this.mediaList.concat(newMediaList)
      this.addMediaList = [{ name: '', categoryId: null }]
      this.$refs.addMediaModal.closeModal()
    },
    openEditModal(media) {
      this.currentMedia = media
      this.$refs.mediaEditModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    },
    findCategory(id) {
      return this.categories.find(category => category.id === id)
    }
  }
}
</script>

<style lang="sass">
</style>
