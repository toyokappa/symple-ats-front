<template lang="pug">
</template>

<script>
export default {
  middleware: ['auth'],
  async fetch({ $axios, params, redirect }) {
    const { organization_id: orgId, token } = params
    await $axios.post(`/${orgId}/organization_recruiters?token=${token}`)
    redirect(`/${orgId}`)
  },
}
</script>
