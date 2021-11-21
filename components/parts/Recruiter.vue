<template lang="pug"> 
.flex.items-center(v-if="recruiter")
  .w-5.h-5.bg-gray-100.rounded-full.mr-1
  .text-xs.text-black {{ recruiter.name }}
</template>

<script>
// TODO: データ基盤ができたらいずれは削除
import { recruiterList } from '@/fixtures'

export default {
  props: {
    recruiterId: {
      type: [Number, null],
    }
  },
  data() {
    return {
      recruiterList
    }
  },
  computed: {
    recruiter() {
      return this.recruiterList.find(recruiter => recruiter.id === this.recruiterId)
    }
  }
}
</script>