<template lang="pug"> 
.flex.items-center(v-if="recruiter")
  .w-5.h-5.bg-gray-100.rounded-full.mr-1
  .text-xs.text-black {{ recruiter.nickname }}
</template>

<script>
export default {
  props: {
    recruiter: {
      type: [Object, null],
    },
  },
}
</script>
