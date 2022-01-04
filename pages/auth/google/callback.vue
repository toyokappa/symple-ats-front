<template lang="pug">
</template>

<script>
export default {
  async fetch({ query, $axios, redirect }) {
    await $axios.post('/auth/google/callback', {
      code: query.code,
    })
    redirect('/')
  },
}
</script>
