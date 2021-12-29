<template lang="pug">
.px-8.py-4
  h2.mb-5 ポジション管理

  //- 検索UI
  .d-flex.align-center.mb-2
    v-text-field.body-2.me-3(
      v-model="searchKeyword"
      append-icon="mdi-magnify"
      placeholder="キーワードで絞り込む"
      dense
      hide-details
    )
    v-autocomplete.body-2.me-3(
      v-model="searchStatus"
      :items="statusList"
      item-text="ja"
      item-value="en"
      placeholder="公開状態で絞り込む"
      dense
      hide-details
    )
    v-btn(
      depressed
      height="40"
      @click.stop="createDialog = true"
    ) ポジションを追加する

  //- 一覧UI
  v-data-table(
    :headers="headers"
    :items="positionList"
    hide-default-footer
  )
    template(v-slot:item.internalName="props")
      v-edit-dialog(
        @open="currentPosition = props.item"
        @close="currentPosition = null"
        @save="update('internalName')"
      ) {{ props.item.internalName }}
        template(v-slot:input)
          v-text-field.body-2(
            v-model="props.item.internalName"
            placeholder="内部管理名"
          )
    template(v-slot:item.externalName="props")
      v-edit-dialog(
        @open="currentPosition = props.item"
        @close="currentPosition = null"
        @save="update('externalName')"
      ) {{ props.item.externalName }}
        template(v-slot:input)
          v-text-field.body-2(
            v-model="props.item.externalName"
            placeholder="外部公開名"
          )
    template(v-slot:item.statusJa="props")
      v-edit-dialog(
        @open="currentPosition = props.item"
        @close="currentPosition = null"
        ref="editStatus"
      ) {{ props.item.statusJa }}
        template(v-slot:input)
          v-autocomplete.body-2(
            v-model="props.item.status"
            :items="statusList"
            item-text="ja"
            item-value="en"
            placeholder="公開状態"
            @change="update('status')"
          )

  //- 作成UI
  v-dialog(
    v-model="createDialog"
    max-width="800"
  )
    v-card
      v-container
        v-card-title
          h3 ポジション追加
        v-card-text
          v-row.mb-2(
            v-for="(addPosition, index) in addPositionList"
            :key="index"
            align="center"
            dense
          )
            v-col(cols="4")
              v-text-field.body-2(
                v-model="addPosition.internalName"
                placeholder="内部管理名"
                outlined
                dense
                hide-details="auto"
              )
            v-col(cols="8")
              v-text-field.body-2(
                v-model="addPosition.externalName"
                placeholder="外部公開名"
                outlined
                dense
                hide-details="auto"
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
                .ms-1 ポジションを更に追加
              v-btn(
                depressed
                @click="create"
              )
                span ポジションの追加を確定する
</template>

<script>
import Position, { statusList } from '@/models/Position'

export default {
  layout: 'signedIn',
  async fetch({ $axios, $auth }) {
    const orgId = $auth.user.organization.uniqueId
    const { data: positionList } = await $axios.get(`/${orgId}/positions`)
    await Position.insertOrUpdate({ data: positionList })
  },
  data() {
    return {
      headers: [
        { text: '内部管理名', value: 'internalName' },
        { text: '外部公開名', value: 'externalName' },
        { text: '公開状態', value: 'statusJa' },
      ],
      statusList,
      searchKeyword: '',
      searchStatus: '',
      createDialog: false,
      addPositionList: [
        {
          internalName: '',
          externalName: '',
        },
      ],
      currentPosition: null,
    }
  },
  methods: {
    add() {
      const position = { internalName: '', externalName: '' }
      this.addPositionList = [...this.addPositionList, position]
    },
    remove(index) {
      this.addPositionList.splice(index, 1)
    },
    async create() {
      if (this.addPositionList.length === 0) return
      // TODO: バリデーションロジックは追加する

      // データ通信
      const newPositionList = await Promise.all(
        this.addPositionList.map(async (position) => {
          const { data } = await this.$axios.post(`/${this.orgId}/positions`, {
            position: {
              internal_name: position.internalName,
              external_name: position.externalName,
            },
          })
          return data
        })
      )
      Position.insert({ data: newPositionList })

      // 初期化
      this.addPositionList = [{ internalName: '', externalName: '' }]
      this.createDialog = false
    },
    async update(field) {
      // 更新したフィールドのみ更新を走らせる
      const fieldSnakeCase = field.replace(
        /[A-Z]/g,
        (s) => '_' + s[0].toLowerCase()
      )
      let position = {}
      position[fieldSnakeCase] = this.currentPosition[field]

      const { data } = await this.$axios.put(
        `/${this.orgId}/positions/${this.currentPosition.id}`,
        { position }
      )
      Position.update({ data })
    },
  },
  computed: {
    orgId() {
      return this.$auth.user.organization.uniqueId
    },
    positionList() {
      return Position.query()
        .where((position) => {
          return (
            (position.internalName.indexOf(this.searchKeyword) !== -1 ||
              position.externalName.indexOf(this.searchKeyword) !== -1) &&
            (position.status.indexOf(this.searchStatus) !== -1 ||
              this.searchStatus === null)
          )
        })
        .get()
    },
  },
}
</script>

<style lang="sass"></style>
