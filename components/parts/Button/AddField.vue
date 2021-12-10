<template lang="pug">
.text-sm.text-gray-300.w-full.border.border-gray-200.rounded.px-2.py-1.cursor-pointer.mb-2(
  @click="$emit('addEvent')"
)
  slot
</template>