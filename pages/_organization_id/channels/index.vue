<template lang="pug">
.w-full
  .p-8
    .text-2xl.font-bold.mb-5 チャネル管理

    //- 検索UI
    .flex.justify-end.mb-2
      input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="searchKeyword")
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="searchCategory" :class="dummyPlaceholder(searchCategory)")
        option(value="" selected) チャネル種別で絞り込む
        option(v-for="cat in categoryList" :value="cat.en" :key="cat.en") {{ cat.ja }}
      button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(@click="$refs.addChannelModal.openModal()") チャネルを追加する

    //- 一覧UI
    table.w-full
      thead.text-sm.text-left.border-t.border-b.border-gray-200
        tr
          parts-table-head-column チャネル名
          parts-table-head-column チャネル種別
          parts-table-head-column 自動起票
          parts-table-head-column 応募URL
      tbody.text-sm
        tr.cursor-pointer(
          v-for="channel in channelList"
          :key="channel.id"
          :class="'hover:bg-gray-100'"
          @click="openEditModal(channel)"
        )
          parts-table-body-column
            parts-text-with-empty-state(:attribute="channel.name")
          parts-table-body-column
            .inline-block.text-xs.text-black.rounded.px-2(
              :class="`bg-${channel.categoryColor}-100 py-0.5`"
            ) {{ channel.categoryJa }}
          parts-table-body-column
            | {{ channel.automationJa }}
          parts-table-body-column
            template(v-if="channel.applyToken !== ''") https://symple.com/{{ channel.applyToken }}
            template(v-else) -

    //- 作成UI
    parts-modal(ref="addChannelModal")
      .text-3xl.font-bold.mb-5 チャネル追加
      .flex.mb-2(v-for="(addChannel, index) in addChannelList" :key="index")
        input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
          type="text"
          v-model="addChannel.name"
          placeholder="チャネル名"
        )
        select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(
          v-model="addChannel.category"
          :class="dummyPlaceholder(addChannel.category)"
        )
          option(value="" selected style="display: none") チャネル種別
          option(v-for="cat in categoryList" :value="cat.en" :key="cat.en") {{ cat.ja }}
        parts-button-remove-field(@removeEvent="remove(index)")
      parts-button-add-field(@addEvent="add()") + チャネルを更に追加する
      parts-button-primary(@submitEvent="create()") チャネルの追加を確定する

    //- 詳細/編集UI
    parts-modal(ref="channelsEditModal")
      template(v-if="currentChannel")
        parts-form-title-like-text-field(
          v-model="currentChannel.name"
          @updateEvent="update('name')"
          ref="nameField"
        )
        .grid.grid-cols-6.mb-2.items-center
          .text-sm チャネル種別
          .col-start-2.col-span-5
            v-select.text-sm.text-gray-300(
              v-model="currentChannel.category"
              placeholder="未入力"
              :options="categoryList"
              :reduce="category => category.en"
              label="ja"
              :class="'v-select-custom-style'"
              @input="update('category')"
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
import Channel, { categoryList, automationList } from '@/models/Channel'

export default {
  layout: 'signedIn',
  async fetch({ $axios }) {
    const { data: channelList } = await $axios.get('/channels')
    Channel.insertOrUpdate({ data: channelList })
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/channels')
    return {
      channels: data,
    }
  },
  data() {
    return {
      categoryList,
      automationList,
      searchKeyword: '',
      searchCategory: '',
      addChannelList: [
        {
          name: '',
          category: '',
        },
      ],
      currentChannel: null,
    }
  },
  methods: {
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
    add() {
      const newChannel = { name: '', category: '' }
      this.addChannelList = [...this.addChannelList, newChannel]
    },
    remove(index) {
      this.addChannelList.splice(index, 1)
    },
    async create() {
      if (this.addChannelList.length === 0) return
      // TODO: バリデーションロジックは追加する

      // データ通信
      const newChannelList = await Promise.all(
        this.addChannelList.map(async (channel) => {
          const { data } = await this.$axios.post('/channels', {
            channel: {
              name: channel.name,
              category: channel.category,
            },
          })
          return data
        })
      )

      Channel.insert({ data: newChannelList })

      // 初期化
      this.addChannelList = [{ name: '', category: '' }]
      this.$refs.addChannelModal.closeModal()
    },
    async update(field) {
      // 更新したフィールドのみ更新を走らせる
      const fieldSnakeCase = field.replace(
        /[A-Z]/g,
        (s) => '_' + s[0].toLowerCase()
      )
      let channel = {}
      channel[fieldSnakeCase] = this.currentChannel[field]
      const { data } = await this.$axios.put(
        `/channels/${this.currentChannel.id}`,
        { channel }
      )
      Channel.update({ data })
    },
    openEditModal(channel) {
      this.currentChannel = channel
      this.$refs.channelsEditModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    },
  },
  computed: {
    channelList() {
      return Channel.query()
        .where((channel) => {
          return (
            channel.name.indexOf(this.searchKeyword) !== -1 &&
            channel.category.indexOf(this.searchCategory) !== -1
          )
        })
        .get()
    },
  },
}
</script>

<style lang="sass"></style>
