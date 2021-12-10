<template lang="pug">
.w-full
  .p-8
    .text-2xl.font-bold.mb-5 媒体管理

    //- 検索UI
    .flex.justify-end.mb-2
      input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="searchKeyword")
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="searchCategory" :class="dummyPlaceholder(searchCategory)")
        option(:value="null" selected) 媒体種別で絞り込む
        option(v-for="cat in categoryList" :value="cat.en" :key="cat.en") {{ cat.ja }}
      button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(@click="$refs.addMediaModal.openModal()") 媒体を追加する

    //- 一覧UI
    table.w-full
      thead.text-sm.text-left.border-t.border-b.border-gray-200
        tr
          parts-table-head-column 媒体名
          parts-table-head-column 媒体種別
          parts-table-head-column 自動起票
          parts-table-head-column 応募URL
      tbody.text-sm
        tr.cursor-pointer(
          v-for="medium in media"
          :key="medium.id"
          :class="'hover:bg-gray-100'"
          @click="openEditModal(medium)"
        )
          parts-table-body-column
            parts-text-with-empty-state(:attribute="medium.name")
          parts-table-body-column
            .inline-block.text-xs.text-black.rounded.px-2(
              :class="`bg-${category(medium.category).color}-100 py-0.5`"
            ) {{ category(medium.category).ja }}
          parts-table-body-column
            | {{ automationJa(medium.automation) }}
          parts-table-body-column
            template(v-if="medium.applyToken") https://symple.com{{ medium.applyToken }}
            template(v-else) -

    //- 作成UI
    parts-modal(ref="addMediaModal")
      .text-3xl.font-bold.mb-5 媒体追加
      .flex.mb-2(v-for="(addMedium, index) in addMedia" :key="index")
        input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
          type="text"
          v-model="addMedium.name"
          placeholder="媒体名"
        )
        select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(
          v-model="addMedium.category"
          :class="dummyPlaceholder(addMedium.category)"
        )
          option(value="" selected style="display: none") 媒体種別
          option(v-for="cat in categoryList" :value="cat.en" :key="cat.en") {{ cat.ja }}
        parts-button-remove-field(@removeEvent="remove(index)")
      parts-button-add-field(@addEvent="add()") + 媒体を更に追加する
      parts-button-primary(@submitEvent="create()") 媒体の追加を確定する

    //- 詳細/編集UI
    parts-modal(ref="mediaEditModal")
      template(v-if="currentMedium")
        parts-form-title-like-text-field(
          v-model="currentMedium.name"
          @updateEvent="update('name')"
          ref="nameField"
        )
        .grid.grid-cols-6.mb-2.items-center
          .text-sm 媒体種別
          .col-start-2.col-span-5
            v-select.text-sm.text-gray-300(
              v-model="currentMedium.category"
              placeholder="未入力"
              :options="categoryList"
              :reduce="category => category.en"
              label="ja"
              :class="'v-select-custom-style'"
            )
              template(#selected-option="option")
                .inline-block.text-xs.text-black.rounded.px-2(
                  :class="`bg-${option.color}-100 py-0.5`"
                ) {{ option.ja }}
              template(v-slot:option="option")
                .inline-block.text-xs.text-black.rounded.px-2(
                  :class="`bg-${option.color}-100 py-0.5`"
                ) {{ option.ja }}
</template>

<script>
import { categoryList, automationList } from '@/fixtures/mediaList'

export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/media')
    return {
      media: data
    }
  },
  data() {
    return {
      categoryList,
      automationList,
      searchKeyword: '',
      searchCategory: null,
      addMedia: [
        {
          name: '',
          category: '',
        },
      ],
      currentMedium: null,
    }
  },
  methods: {
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
    add() {
      const newMedium = { name: '', category: '' }
      this.addMedia = [...this.addMedia, newMedium]
    },
    remove(index) {
      this.addMedia.splice(index, 1)
    },
    create() {
      if (this.addMedia.length === 0) return
      // TODO: バリデーションロジックは追加する

      // データ通信
      this.addMedia.forEach(medium => {
        this.$axios.post('/media', {
          medium: {
            name: medium.name,
            category: medium.category
          }
        })
      })

      // 画面描画
      const newMedia = this.addMedia.map((medium, index) => {
        medium.id = this.media.length + index + 1
        medium.automation = 'disable'
        return medium
      })
      this.media = this.media.concat(newMedia)

      // 初期化
      this.addMedia = [{ name: '', category: '' }]
      this.$refs.addMediaModal.closeModal()
    },
    update(field) {
      // 更新したフィールドのみ更新を走らせる
      const fieldSnakeCase = field.replace(/[A-Z]/g, s => '_' + s[0].toLowerCase())
      let medium = {}
      medium[fieldSnakeCase] = this.currentMedium[field]
      this.$axios.put(`/media/${this.currentMedium.id}`, { medium })
    },
    openEditModal(media) {
      this.currentMedium = media
      this.$refs.mediaEditModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    },
    category(categoryEn) {
      return this.categoryList.find(category => category.en === categoryEn)
    },
    automationJa(en) {
      return this.automationList.find(item => item.en === en).ja
    }
  },
  watch: {
    // 更新したフィールドのみ更新を走らせる
    'currentMedium.category': function() {
      this.update('category')
    }
  }
}
</script>

<style lang="sass">
</style>
