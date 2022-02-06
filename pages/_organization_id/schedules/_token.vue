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
              .mb-3(v-for="time in vacantTimes" :key="time.value")
                v-btn(
                  block
                  outlined
                  :color="time.value === eventField.startTime ? 'primary' : ''"
                  @click="eventField.startTime=time.value"
                ) {{ time.text }}
            v-divider(vertical)
            v-col(cols="8")
              .mb-3
                .grey--text.mb-1 会社名
                v-text-field.body-2(
                  v-model="eventField.companyName"
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
                      v-model="eventField.lastName"
                      placeholder="姓"
                      dense
                      outlined
                      hide-details="auto"
                    )
                  v-col(cols="6")
                    v-text-field.body-2(
                      v-model="eventField.firstName"
                      placeholder="名"
                      dense
                      outlined
                      hide-details="auto"
                    )
              .mb-3
                .grey--text.mb-1 メールアドレス
                v-text-field.body-2(
                  v-model="eventField.email"
                  type="email"
                  suffix="注: 間違えると通知を受け取れません"
                  dense
                  outlined
                  hide-details="auto"
                )
              .mt-5.text-right
                v-btn(
                  color="primary"
                  @click="createEvent"
                ) 日程を確定する
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(`/schedules/${params.token}`)
    const events = data.map((schedule) => {
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
      eventField: {
        startTime: null,
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
      },
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
          return {
            value: unixtime,
            text: this.$dateFns.format(new Date(unixtime), 'H:mm開始'),
          }
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
    createEvent() {
      const { startTime, companyName, firstName, lastName, email } =
        this.eventField
      const summary = `${companyName} ${lastName} ${firstName}`
      const endTime = startTime + 60 * 60 * 1000
      const event = {
        summary,
        start: new Date(startTime),
        end: new Date(endTime),
        email: email,
      }
      this.$axios.put(`/schedules/${this.$route.params.token}`, { event })
    },
    // TODO: フィールドを閉じた時に情報がリセットされるメソッドを追加
  },
}
</script>
