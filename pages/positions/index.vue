<template lang="pug">
.w-full
  .p-8
    .text-2xl.font-bold.mb-5 ポジション管理

    //- 検索UI
    .flex.justify-end.mb-2
      input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="searchKeyword")
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="searchStatus" :class="dummyPlaceholder(searchStatus)")
        option(value="" selected) 公開状態で絞り込む
        option(v-for="status in statusList" :value="status.en" :key="status.en") {{ status.ja }}
      button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(@click="$refs.addPositionModal.openModal()") ポジションを追加する

    //- 一覧UI
    table.w-full
      thead.text-sm.text-left.border-t.border-b.border-gray-200
        tr
          parts-table-head-column 内部管理用のポジション名
          parts-table-head-column 外部公開用のポジション名
          parts-table-head-column 公開状態
      tbody.text-sm
        tr.cursor-pointer(
          v-for="position in positionList"
          :key="position.id"
          :class="'hover:bg-gray-100'"
          @click="openEditModal(position)"
        )
          parts-table-body-column
            parts-text-with-empty-state(:attribute="position.internalName")
          parts-table-body-column
            parts-text-with-empty-state(:attribute="position.externalName")
          parts-table-body-column
            | {{ position.statusJa }}

    //- 作成UI
    parts-modal(ref="addPositionModal")
      .text-3xl.font-bold.mb-5 ポジション追加
      .flex.mb-2(v-for="(addPosition, index) in addPositionList" :key="index")
        input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
          type="text"
          v-model="addPosition.internalName"
          placeholder="内部管理用のポジション名"
        )
        input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
          type="text"
          v-model="addPosition.externalName"
          placeholder="外部効果用のポジション名"
        )
        parts-button-remove-field(@removeEvent="remove(index)")
      parts-button-add-field(@addEvent="add()") + ポジションを更に追加する
      parts-button-primary(@submitEvent="create()") ポジションの追加を確定する

    //- 詳細/編集UI
    parts-modal(ref="positionEditModal")
      template(v-if="currentPosition")
        parts-form-title-like-text-field(
          v-model="currentPosition.internalName"
          @updateEvent="update('internalName')"
          ref="nameField"
        )
        .grid.grid-cols-9.mb-2.items-center
          .col-span-2
            .text-sm 外部公開用の名前
          .col-start-3.col-span-7
            parts-form-text-like-text-field(
              v-model="currentPosition.externalName"
              @updateEvent="update('externalName')"
            )
        .grid.grid-cols-9.mb-2.items-center
          .col-span-2
            .text-sm 公開状態
          .col-start-3.col-span-7
            v-select.text-sm.text-gray-300(
              v-model="currentPosition.status"
              placeholder="未入力"
              :options="statusList"
              :reduce="status => status.en"
              label="ja"
              :class="'v-select-custom-style'"
              name="status"
              @input="update('status')"
            )
              template(#selected-option="option")
                .text-sm {{ option.ja }}
              template(v-slot:option="option")
                .text-sm {{ option.ja }}
</template>

<script>
import Position, { statusList } from '../../models/Position'

export default {
  async fetch({ $axios }) {
    const { data: positionList } = await $axios.get('/positions')
    await Position.insertOrUpdate({ data: positionList })
  },
  data() {
    return {
      statusList,
      searchKeyword: '',
      searchStatus: '',
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
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
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
          const { data } = await this.$axios.post('/positions', {
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
      this.$refs.addPositionModal.closeModal()
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
        `/positions/${this.currentPosition.id}`,
        { position }
      )
      Position.update({ data })
    },
    openEditModal(position) {
      this.currentPosition = position
      this.$refs.positionEditModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    },
  },
  computed: {
    positionList() {
      return Position.query()
        .where((position) => {
          return (
            (position.internalName.indexOf(this.searchKeyword) !== -1 ||
              position.externalName.indexOf(this.searchKeyword) !== -1) &&
            position.status.indexOf(this.searchStatus) !== -1
          )
        })
        .get()
    },
  },
}
</script>

<style lang="sass"></style>
