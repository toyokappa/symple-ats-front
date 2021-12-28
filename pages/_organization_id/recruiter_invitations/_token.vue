<template lang="pug">
</template>

<script>
export default {
  async fetch({ $axios, params, redirect }) {
    const { organization_id: orgId, token } = params
    await $axios.get(`/${orgId}/recruiter_invitations/${token}`)
    redirect(`/${orgId}`)
  },
}
</script>
