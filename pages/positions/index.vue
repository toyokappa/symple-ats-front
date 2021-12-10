<template lang="pug">
.w-full
  .p-8
    .text-2xl.font-bold.mb-5 ポジション管理
    .flex.justify-end.mb-2
      input.text-sm.border.border-gray-200.rounded.px-2.py-1.w-72.mr-2(type="text" v-model="keyword")
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="status" :class="dummyPlaceholder(status)")
        option(value="" selected) 公開状態で絞り込む
        option(v-for="state in statusList" :value="state.en" :key="state.en") {{ state.ja }}
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
            template(v-if="position.internalName") {{ position.internalName }}
            .text-gray-400(v-else) 未入力
          td.px-2.py-3
            template(v-if="position.externalName") {{ position.externalName }}
            .text-gray-400(v-else) 未入力
          td.px-2.py-3 {{ statusJa(position.status) }}
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
          @click="createPosition()"
        ) ポジションの追加を確定する
    parts-modal(ref="positionEditModal")
      template(v-if="currentPosition")
        input.text-3xl.font-bold.outline-none.placeholder-gray-300.mb-5(
          type="text"
          v-model="currentPosition.internalName"
          placeholder="名前未入力"
          ref="nameField"
          name="internalName"
          @blur="updatePosition"
        )
        .grid.grid-cols-9.mb-2.items-center
          .col-span-2
            .text-sm 外部公開用の名前
          .col-start-3.col-span-7
            input.text-sm.w-full.rounded.outline-none.border.border-transparent.placeholder-gray-300.px-2.py-1(
              type="text"
              v-model="currentPosition.externalName"
              :class="'hover:bg-gray-100 focus:bg-white focus:shadow-lg focus:border-gray-100'"
              placeholder="未入力"
              name="externalName"
              @blur="updatePosition"
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
            )
              template(#selected-option="option")
                .text-sm {{ option.ja }}
              template(v-slot:option="option")
                .text-sm {{ option.ja }}
</template>

<script>
import { statusList } from '@/fixtures/positionList'

export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/positions')
    return {
      positionList: data
    }
  },
  data() {
    return {
      statusList,
      keyword: '',
      status: '',
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
    addPosition() {
      const position = { internalName: '', externalName: '' }
      this.addPositionList = [...this.addPositionList, position]
    },
    removePosition(index) {
      this.addPositionList.splice(index, 1)
    },
    createPosition() {
      if (this.addPositionList.length === 0) return
      // TODO: バリデーションロジックは追加する

      this.addPositionList.forEach(position => {
        this.$axios.post('/positions', {
          position: {
            internal_name: position.internalName,
            external_name: position.externalName,
          }
        })
      })
      const newPositionList = this.addPositionList.map((position, index) => {
        position.id = this.positionList.length + index + 1
        position.status = 'open'
        return position
      })
      this.positionList = this.positionList.concat(newPositionList)
      this.addPositionList = [{ internalName: '', externalName: '' }]
      this.$refs.addPositionModal.closeModal()
    },
    updatePosition(event) {
      const field = event.target.name
      const fieldSnakeCase = field.replace(/[A-Z]/g, s => '_' + s[0].toLowerCase())
      let position = {}
      position[fieldSnakeCase] = this.currentPosition[field]
      this.$axios.put(`/positions/${this.currentPosition.id}`, { position })
    },
    openEditModal(position) {
      this.currentPosition = position
      this.$refs.positionEditModal.openModal()
      this.$nextTick(() => {
        this.$refs.nameField.focus()
      })
    },
    statusJa(status) {
      if (status === 'open') {
        return '公開中'
      } else {
        return '非公開'
      }
    }
  },
  watch: {
    'currentPosition.status': function(val) {
      this.$axios.put(`/positions/${this.currentPosition.id}`, { position: { status: val } })
    }
  }
}
</script>

<style lang="sass">
</style>
