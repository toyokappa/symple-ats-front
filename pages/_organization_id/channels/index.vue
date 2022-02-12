<template lang="pug">
.px-8.py-4
  h2.mb-5 チャネル管理

  //- 検索UI
  v-row(no-gutters).mb-2
    v-col(
      offset-md="4"
      md="8"
    )
      .d-flex.align-center
        v-text-field.body-2.me-3(
          v-model="searchKeyword"
          append-icon="mdi-magnify"
          placeholder="キーワードで絞り込む"
          dense
          hide-details
        )
        v-autocomplete.body-2.me-3(
          v-model="searchCategory"
          :items="categoryList"
          item-text="ja"
          item-value="en"
          placeholder="チャネル種別で絞り込む"
          dense
          hide-details
        )
        v-btn(
          small
          depressed
          height="32"
          @click.stop="createDialog = true"
        ) チャネルを追加する

  //- 一覧UI
  v-data-table(
    :headers="headers"
    :items="channelList"
    hide-default-footer
  )
    template(v-slot:item="{ item }")
      tr.cursor-pointer(@click.stop="openUpdateDialog(item)")
        td.text-start {{ item.name }}
        td.text-start
          v-chip(
            :color="item.categoryColor + ' lighten-1'"
            small
            label
          )
            .white--text.font-weight-bold {{ item.categoryJa }}
        td.text-start {{ item.automationJa }}
        td.text-start {{ item.applyUrl }}

  //- 作成UI
  v-dialog(
    v-model="createDialog"
    max-width="800"
  )
    v-card
      v-container
        v-card-title
          h3 チャネル追加
        v-card-text
          v-form(
            v-model="valid.create"
            lazy-validation
            ref="createForm"
          )
            v-row(
              v-for="(addChannel, index) in addChannelList"
              :key="index"
              align="center"
              dense
            )
              v-col(cols="6")
                v-text-field.body-2(
                  v-model="addChannel.name"
                  :rules="nameRules"
                  placeholder="チャネル名"
                )
              v-col(cols="6")
                v-autocomplete.body-2(
                  v-model="addChannel.category"
                  :rules="categoryRules"
                  :items="categoryList"
                  item-text="ja"
                  item-value="en"
                  placeholder="チャネル種別"
                  append-outer-icon="mdi-delete"
                  @click:append-outer="remove"
                )
            .mb-3
              .d-flex.align-center.justify-space-between
                v-btn(
                  text
                  @click="add"
                )
                  v-icon mdi-expand-all
                  .ms-1 チャネルを更に追加
                v-btn(
                  depressed
                  @click="create"
                )
                  span チャネルの追加を確定する

  //- 詳細/編集UI
  template(v-if="currentChannel")
    v-dialog(
      v-model="updateDialog"
      max-width="800"
    )
      v-card
        v-container
          v-card-text
            v-form(
              v-model="valid.name"
              @submit.prevent
            )
              .d-flex
                v-text-field.text-h5.font-weight-bold.mb-2(
                  v-model="currentChannel.name"
                  :rules="nameRules"
                  flat
                  solo
                  dense
                  placeholder="未入力"
                  hide-details="auto"
                  @blur="update('name')"
                )
                v-menu(
                  offset-y
                  left
                )
                  template(v-slot:activator="{ on, attrs }")
                    v-btn(
                      icon
                      tile
                      v-bind="attrs"
                      v-on="on"
                    )
                      v-icon mdi-dots-vertical
                  v-list(dense)
                    v-list-item(
                      link
                      @click="deleteChannel()"
                    )
                      v-list-item-title チャネルを削除
            v-container
              v-row(
                dense
              )
                v-col.py-2.grey--text(
                  cols="2"
                ) チャネル種別
                v-col.py-0(
                  cols="10"
                )
                  v-form.mb-1(
                    v-model="valid.category"
                    @submit.prevent
                  )
                    v-autocomplete.body-2(
                      v-model="currentChannel.category"
                      append-icon=""
                      :rules="categoryRules"
                      :items="categoryList"
                      item-text="ja"
                      item-value="en"
                      :flat="flat.category"
                      solo
                      dense
                      hide-details="auto"
                      @focus="flat.category = false"
                      @blur="update('category')"
                    )
                      template(v-slot:selection="{ item }")
                        v-chip(
                          :color="item.color + ' lighten-1'"
                          small
                          label
                        )
                          .white--text.font-weight-bold {{ item.ja }}
                      template(v-slot:item="{ item }")
                        v-chip(
                          :color="item.color + ' lighten-1'"
                          small
                          label
                        )
                          .white--text.font-weight-bold {{ item.ja }}
              v-row.mb-2(
                dense
              )
                v-col.grey--text(
                  cols="2"
                ) 自動起票
                v-col.px-5(
                  cols="10"
                ) {{ currentChannel.automationJa }}
              v-row(
                dense
              )
                v-col.grey--text(
                  cols="2"
                ) 応募URL
                v-col.px-5(
                  cols="10"
                ) {{ currentChannel.applyUrl }}
</template>

<script>
import Channel, {
  categoryList,
  automationList,
  nameRules,
  categoryRules,
} from '@/models/Channel'

export default {
  layout: 'signedIn',
  async fetch({ $axios, $auth }) {
    const orgId = $auth.user.organization.uniqueId
    const { data: channelList } = await $axios.get(`/${orgId}/channels`)
    Channel.insertOrUpdate({ data: channelList })
  },
  data() {
    return {
      headers: [
        { text: 'チャネル名', value: 'name' },
        { text: 'チャネル種別', value: 'categoryJa' },
        { text: '自動起票', value: 'automationJa' },
        { text: '応募URL', value: 'applyUrl' },
      ],
      categoryList,
      automationList,
      nameRules,
      categoryRules,
      valid: {
        create: true,
        name: true,
        category: true,
      },
      flat: {
        category: true,
      },
      searchKeyword: '',
      searchCategory: '',
      createDialog: false,
      updateDialog: false,
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
    add() {
      const newChannel = { name: '', category: '' }
      this.addChannelList = [...this.addChannelList, newChannel]
    },
    remove(index) {
      this.addChannelList.splice(index, 1)
    },
    async create() {
      if (this.addChannelList.length === 0) return

      await this.$refs.createForm.validate()
      if (!this.valid.create) return

      // データ通信
      const newChannelList = await Promise.all(
        this.addChannelList.map(async (channel) => {
          const { data } = await this.$axios.post(`/${this.orgId}/channels`, {
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
      this.createDialog = false
    },
    async update(field) {
      if (!this.valid[field]) return

      // 更新したフィールドのみ更新を走らせる
      const fieldSnakeCase = field.replace(
        /[A-Z]/g,
        (s) => '_' + s[0].toLowerCase()
      )
      let channel = {}
      channel[fieldSnakeCase] = this.currentChannel[field]
      const { data } = await this.$axios.put(
        `/${this.orgId}/channels/${this.currentChannel.id}`,
        { channel }
      )
      Channel.update({ data })
      this.flat[field] = true
    },
    async deleteChannel() {
      const isDelete = await confirm('本当に削除してよろしいですか？')
      if (!isDelete) return

      const { data } = await this.$axios.delete(
        `/${this.orgId}/channels/${this.currentChannel.id}`
      )
      this.updateDialog = false
      Channel.delete(data.id)
    },
    openUpdateDialog(channel) {
      this.currentChannel = channel
      this.updateDialog = true
    },
  },
  computed: {
    orgId() {
      return this.$auth.user.organization.uniqueId
    },
    channelList() {
      return Channel.query()
        .where((channel) => {
          return (
            channel.name.indexOf(this.searchKeyword) !== -1 &&
            (channel.category.indexOf(this.searchCategory) !== -1 ||
              this.searchCategory === null)
          )
        })
        .get()
    },
  },
}
</script>

<style lang="sass"></style>
