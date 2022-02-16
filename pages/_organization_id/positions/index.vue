<template lang="pug">
.px-8.py-4
  h2.mb-5 ポジション管理

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
          v-model="searchStatus"
          :items="statusList"
          item-text="ja"
          item-value="en"
          placeholder="公開状態で絞り込む"
          dense
          hide-details
        )
        v-btn(
          small
          depressed
          height="32"
          @click.stop="createDialog = true"
        ) ポジションを追加する

  //- 一覧UI
  v-data-table(
    :headers="headers"
    :items="positionList"
    hide-default-footer
  )
    template(v-slot:item="{ item }")
      tr.cursor-pointer(@click.stop="openUpdateDialog(item)")
        td.text-start {{ item.internalName }}
        td.text-start {{ item.externalName }}
        td.text-start {{ item.statusJa }}

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
          v-form(
            v-model="valid.create"
            lazy-validation
            ref="createForm"
          )
            v-row(
              v-for="(addPosition, index) in addPositionList"
              :key="index"
              align="center"
              dense
            )
              v-col(cols="4")
                v-text-field.body-2(
                  v-model="addPosition.internalName"
                  placeholder="内部管理名"
                  :rules="internalNameRules"
                  hide-details="auto"
                )
              v-col(cols="8")
                v-text-field.body-2(
                  v-model="addPosition.externalName"
                  placeholder="外部公開名"
                  :rules="externalNameRules"
                  hide-details="auto"
                  append-outer-icon="mdi-delete"
                  @click:append-outer="remove"
                )
            .mt-5
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

  //- 編集UI
  template(v-if="currentPosition")
    v-dialog(
      v-model="updateDialog"
      max-width="800"
    )
      v-card
        v-container
          v-card-text
            v-form(
              v-model="valid.internalName"
              @submit.prevent
            )
              .d-flex
                v-text-field.text-h5.font-weight-bold.mb-2(
                  v-model="currentPosition.internalName"
                  :rules="internalNameRules"
                  flat
                  solo
                  dense
                  placeholder="未入力"
                  hide-details="auto"
                  @blur="update('internalName')"
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
                      @click="deletePosition()"
                    )
                      v-list-item-title ポジションを削除
            v-container
              v-row(
                dense
              )
                v-col.py-2.grey--text(
                  cols="2"
                ) 外部公開名
                v-col.py-0(
                  cols="10"
                )
                  v-form.mb-1(
                    v-model="valid.externalName"
                    @submit.prevent
                  )
                    v-text-field.body-2(
                      v-model="currentPosition.externalName"
                      :rules="externalNameRules"
                      dense
                      :flat="flat.externalName"
                      solo
                      placeholder="未入力"
                      hide-details="auto"
                      @focus="flat.externalName = false"
                      @blur="update('externalName')"
                    )
              v-row(
                dense
              )
                v-col.py-2.grey--text(
                  cols="2"
                ) 公開状態
                v-col.py-0(
                  cols="10"
                )
                  v-autocomplete.body-2(
                    v-model="currentPosition.status"
                    append-icon=""
                    :items="statusList"
                    item-text="ja"
                    item-value="en"
                    :flat="flat.status"
                    solo
                    dense
                    hide-details="auto"
                    @focus="flat.status = false"
                    @blur="update('status')"
                  )
</template>

<script>
import Position, {
  statusList,
  internalNameRules,
  externalNameRules,
} from '@/models/Position'

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
      internalNameRules,
      externalNameRules,
      valid: {
        create: true,
        internalName: true,
        externalName: true,
        status: true,
      },
      flat: { externalName: true, status: true },
      searchKeyword: '',
      searchStatus: '',
      createDialog: false,
      updateDialog: false,
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

      await this.$refs.createForm.validate()
      if (!this.valid.create) return

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
      if (!this.valid[field]) return

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
      this.flat[field] = true
    },
    openUpdateDialog(position) {
      this.currentPosition = position
      this.updateDialog = true
    },
    async deletePosition() {
      const isDelete = await confirm('本当に削除してよろしいですか？')
      if (!isDelete) return

      const { data } = await this.$axios.delete(
        `/${this.orgId}/positions/${this.currentPosition.id}`
      )
      this.updateDialog = false
      Position.delete(data.id)
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
