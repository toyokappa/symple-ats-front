export default async function ({ $axios, $auth, redirect }) {
  if ($auth.loggedIn) {
    const { data: user } = await $axios.get('/auth/recruiter')
    redirect(`/${user.organization.uniqueId}`)
  }
}
