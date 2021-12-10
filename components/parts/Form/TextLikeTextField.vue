<template lang="pug">
input.text-sm.w-full.rounded.outline-none.border.border-transparent.placeholder-gray-300.px-2.py-1(
  type="text"
  v-model="inputValue"
  :class="'hover:bg-gray-100 focus:bg-white focus:shadow-lg focus:border-gray-100'"
  placeholder="未入力"
  @blur="$emit('updateEvent')"
)
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    // 親コンポーネントからv-modelで引き継いだものがread-onlyなのでmutableに書き換える
    inputValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit("input", newValue)
      }
    }
  }
}
</script>