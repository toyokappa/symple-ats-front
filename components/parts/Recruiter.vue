<template lang="pug"> 
.flex.items-center(v-if="recruiter")
  .w-5.h-5.bg-gray-100.rounded-full.mr-1
  .text-xs {{ recruiter.name }}
</template>

<script>
export default {
  props: {
    recruiterId: {
      type: [Number, null],
    }
  },
  data() {
    const recruiterList = [
      {
        id: 1,
        name: 'toyokawa',
      },
      {
        id: 2,
        name: 'yamada',
      },
      {
        id: 3,
        name: 'tanaka',
      },
    ]
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