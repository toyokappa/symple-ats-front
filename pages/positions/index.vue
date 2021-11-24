<template lang="pug">
.w-full
  .p-8
    .text-2xl.font-bold.mb-5 ポジション管理
    .flex.justify-end.mb-2
      input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="keyword")
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="status" :class="dummyPlaceholder(status)")
        option(value="" selected) 公開状態で絞り込む
        option(v-for="state in statusList" :value="state" :key="state") {{ state }}
      button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(@click="$refs.addPositionModal.openModal()") ポジションを追加する
    table.w-full
      thead.text-sm.text-left.border-t.border-b.border-gray-200
        tr
          th.px-2.py-3 内部管理用のポジション名
          th.px-2.py-3 外部公開用のポジション名
          th.px-2.py-3 公開状態
      tbody.text-sm
        tr.cursor-pointer(
          v-for="position in positionList"
          :key="position.id"
          :class="'hover:bg-gray-100'"
          @click="openEditModal(position)"
        )
          td.px-2.py-3
            template(v-if="position.name") {{ position.name }}
            .text-gray-400(v-else) 未入力
          td.px-2.py-3
            template(v-if="position.outsideName") {{ position.outsideName }}
            .text-gray-400(v-else) 未入力
          td.px-2.py-3 {{ position.status }}
    parts-modal(ref="addPositionModal")
      .text-3xl.font-bold.mb-5 ポジション追加
      .flex.mb-2(v-for="(addPosition, index) in addPositionList" :key="index")
        input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
          type="text"
          v-model="addPosition.name"
          placeholder="内部管理用のポジション名"
        )
        input.text-sm.w-full.border.border-gray-200.rounded.px-2.py-1.mr-2.placeholder-gray-300(
          type="text"
          v-model="addPosition.outsideName"
          placeholder="外部効果用のポジション名"
        )
        .text-sm.text-gray-300.border.border-gray-200.rounded.px-2.py-1.cursor-pointer(
          @click="removePosition(index)"
        ) ×
      .text-sm.text-gray-300.w-full.border.border-gray-200.rounded.px-2.py-1.cursor-pointer.mb-2(
        @click="addPosition()"
      ) + ポジションを更に追加する
      .text-right
        button.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(
          @click="submitPosition()"
        ) ポジションの追加を確定する
    parts-modal(ref="positionEditModal")
      template(v-if="currentPosition")
        input.text-3xl.font-bold.outline-none.placeholder-gray-300.mb-5(
          type="text"
          v-model="currentPosition.name"
          placeholder="名前未入力"
          ref="nameField"
        )
        .grid.grid-cols-9.mb-2.items-center
          .col-span-2
            .text-sm 外部公開用の名前
          .col-start-3.col-span-7
            input.text-sm.w-full.rounded.outline-none.border.border-transparent.placeholder-gray-300.px-2.py-1(
              type="text"
              v-model="currentPosition.outsideName"
              :class="'hover:bg-gray-100 focus:bg-white focus:shadow-lg focus:border-gray-100'"
              placeholder="未入力"
            )
        .grid.grid-cols-9.mb-2.items-center
          .col-span-2
            .text-sm 公開状態
          .col-start-3.col-span-7
            v-select.text-sm.text-gray-300(
              v-model="currentPosition.status"
              placeholder="未入力"
              :options="statusList"
              :class="'v-select-custom-style'"
            )
              template(#selected-option="option")
                .text-sm {{ option.label }}
              template(v-slot:option="option")
                .text-sm {{ option.label }}
</template>

<script>
import { positionList } from '@/fixtures'
import { statusList } from '@/fixtures/positionList'

export default {
  data() {
    return {
      positionList,
      statusList,
      keyword: '',
      status: '',
      addPositionList: [
        {
          name: '',
          outsideName: '',
        },
      ],
      currentPosition: null,
    }
  },
  methods: {
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
    addPosition() {
      const position = { name: '', outsideName: '' }
      this.addPositionList = [...this.addPositionList, position]
    },
    removePosition(index) {
      this.addPositionList.splice(index, 1)
    },
    submitPosition() {
      if (this.addPositionList.length === 0) return
      // TODO: バリデーションロジックは追加する

      const newPositionList = this.addPositionList.map((position, index) => {
        position.id = this.positionList.length + index + 1
        position.status = '公開中'
        return position
      })
      this.positionList = this.positionList.concat(newPositionList)
      this.addPositionList = [{ name: '', outsideName: '' }]
      this.$refs.addPositionModal.closeModal()
    },
    openEditModal(position) {
      this.currentPosition = position
      this.$refs.positionEditModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    },
  }
}
</script>

<style lang="sass">
</style>
