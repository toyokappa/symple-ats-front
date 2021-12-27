export default async function ({ $axios, $auth, route }) {
  const res = await $axios.get('/auth/recruiter', {
    params: {
      organization_id: route.params.organization_id,
    },
  })
  if (res.status === 404) return

  $auth.setUser(res.data)
}
