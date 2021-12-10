<template lang="pug">
button.block.ml-auto.text-sm.text-white.bg-blue-400.border.rounded.px-2.py-1(
  @click="$emit('submitEvent')"
)
  slot
</template>