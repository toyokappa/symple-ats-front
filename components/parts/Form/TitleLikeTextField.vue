<template lang="pug">
input.text-3xl.font-bold.outline-none.placeholder-gray-300.mb-5(
  type="text"
  v-model="inputValue"
  placeholder="未入力"
  ref="field"
  @blur="$emit('updateEvent')"
)
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    focus() {
      this.$refs.field.focus()
    },
  },
  computed: {
    // 親コンポーネントからv-modelで引き継いだものがread-onlyなのでmutableに書き換える
    inputValue: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit('input', newValue)
      },
    },
  },
}
</script>
