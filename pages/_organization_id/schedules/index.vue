<template lang="pug">
.px-8.py-4
  v-sheet.d-flex.align-center(
    tile
    height="64"
  )
    v-btn.mr-4(
      outlined
      color="grey darken-2"
      @click="value = ''"
    ) 今日
    v-btn(
      icon
      @click="$refs.calendar.prev()"
    )
      v-icon mdi-chevron-left
    v-btn.mr-4(
      icon
      @click="$refs.calendar.next()"
    )
      v-icon mdi-chevron-right
    .text-h6(v-if="$refs.calendar") {{ $refs.calendar.title }}
  v-calendar(
    ref="calendar"
    v-model="value"
    type="week"
    color="primary"
    :events="events"
    first-interval="8"
  )
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/schedules')
    const events = data.schedules.map((schedule) => {
      return {
        name: '予定あり',
        start: new Date(schedule.from),
        end: new Date(schedule.to),
        color: 'primary',
        timed: true,
      }
    })
    return {
      events,
    }
  },
  data() {
    return {
      value: '',
    }
  },
}
</script>
