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
    @click:event="clickEvent"
  )
  v-dialog(
    v-model="scheduleDialog"
    max-width="800"
  )
    v-card
      v-container
        v-card-text
          .text-h5.font-weight-bold.mb-5 日程調整
          v-row
            v-col(cols="4")
              .grey--text.mb-1 開始時間の選択
              .mb-3(v-for="time in vacantTimes" :key="time")
                v-btn(
                  block
                  outlined
                ) {{ time }}
            v-divider(vertical)
            v-col(cols="8")
              .mb-3
                .grey--text.mb-1 会社名
                v-text-field.body-2(
                  placeholder="学生は学校名を入力してください"
                  dense
                  outlined
                  hide-details="auto"
                )
              .mb-3
                .grey--text.mb-1 氏名
                v-row(dense)
                  v-col(cols="6")
                    v-text-field.body-2(
                      placeholder="姓"
                      dense
                      outlined
                      hide-details="auto"
                    )
                  v-col(cols="6")
                    v-text-field.body-2(
                      placeholder="名"
                      dense
                      outlined
                      hide-details="auto"
                    )
              .mb-3
                .grey--text.mb-1 メールアドレス
                v-text-field.body-2(
                  type="email"
                  suffix="注: 間違えると通知を受け取れません"
                  dense
                  outlined
                  hide-details="auto"
                )
              .mt-5.text-right
                v-btn(
                  color="primary"
                ) 日程を確定する
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/schedules')
    const events = data.schedules.map((schedule) => {
      return {
        name: '調整可能',
        start: new Date(schedule.start),
        end: new Date(schedule.end),
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
      vacantTimes: [],
      scheduleDialog: false,
    }
  },
  methods: {
    clickEvent(e) {
      const start = this.toTime(e.eventParsed.start)
      const end = this.toTime(e.eventParsed.end)
      const vacantTimesLength = (end - start) / (1800 * 1000) - 1
      this.vacantTimes = Array(vacantTimesLength)
        .fill()
        .map((_, i) => {
          let unixtime = start + 1800 * 1000 * i
          return this.$dateFns.format(new Date(unixtime), 'H:mm開始')
        })
      this.scheduleDialog = true
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime()
    },
  },
}
</script>
