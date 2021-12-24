<template lang="pug">
.w-full
  .p-8
    .flex.justify-end.mb-2
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="filter.section" :class="dummyPlaceholder(filter.section)")
        option(value="" selected) チャネル種別で絞り込む
        option(v-for="channels in channelsSelection" :value="channels" :key="channels") {{ channels }}
      select.text-sm.border.border-gray-200.rounded.px-2.py-1.mr-2(v-model="filter.position" :class="dummyPlaceholder(filter.position)")
        option(value="" selected) ポジションで絞り込む
        option(v-for="position in positionList" :value="position.id" :key="position.id") {{ position.internalName }}
    .relative.mb-3
      .absolute.flex.w-full
        .flex-1.p-3(v-for="(value, index) in displayValues" :key="index")
          .text-gray-500 {{ chartLabels[index] }}
          .text-2xl.font-bold {{ value }}
          .font-bold.text-gray-500(v-if="index < displayValues.length - 1")
            span.text-base.mr-px {{ valuePercentage[index] }}
            span.text-xs %
      line-chart(:chartData="chartData" :options="options" :height="150")
    table.w-full
      thead.text-sm.text-left.border-t.border-b.border-gray-200
        tr
          th.px-2.py-3.w-32 区分
          template(v-for="(label, index) in displayLabels")
            th.px-2.py-3.text-center {{ label }}
            template(v-if="index < displayLabels.length - 1")
              th.px-2.py-3.text-center.text-xs
      tbody.text-sm
        tr.cursor-pointer(
          v-for="(data, index) in analytics.datasets"
          :class="{ 'bg-gray-100': index === currentDatasetsIndex }"
          :key="data.dataName"
          @click="selectDatasets(index)"
        )
          td.px-2.py-3 {{ data.dataName }}
          template(v-for="(value, i) in filterDisplayValues(index)")
            td.px-2.py-3.text-center {{ value }}
            template(v-if="i < filterDisplayValues(index).length - 1")
              td.px-2.py-3.text-center.text-xs {{ (filterDisplayValues(index)[i + 1] / value * 100).toFixed(1) }}%
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const { data: analytics } = await $axios.get('/analytics')
    const { data: positionList } = await $axios.get('/positions')
    return {
      analytics,
      positionList,
    }
  },
  data() {
    return {
      filter: {
        section: '',
        position: '',
      },
      currentDatasetsIndex: 0,
    }
  },
  methods: {
    filterDisplayValues(index) {
      return this.analytics.datasets[index].values.filter(
        (_, index) => index < this.dataValues.length - 1
      )
    },
    selectDatasets(index) {
      this.currentDatasetsIndex = index
    },
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
  },
  computed: {
    dataValues() {
      return this.analytics.datasets[this.currentDatasetsIndex].values
    },
    chartLabels() {
      return this.analytics.labels
    },
    displayValues() {
      return this.dataValues.filter(
        (_, index) => index < this.dataValues.length - 1
      )
    },
    displayLabels() {
      return this.chartLabels.filter(
        (_, index) => index < this.chartLabels.length - 1
      )
    },
    valuePercentage() {
      return this.dataValues.map((value, index) =>
        ((this.dataValues[index + 1] / value) * 100).toFixed(1)
      )
    },
    channelsSelection() {
      return this.analytics.datasets.map((data) => data.dataName)
    },
    chartData() {
      return {
        datasets: [
          {
            data: this.dataValues,
            label: '候補者数',
          },
        ],
        labels: this.chartLabels,
      }
    },
    options() {
      return {
        legend: {
          display: false,
        },
        labels: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: false,
                beginAtZero: true,
              },
              gridLines: {
                display: false,
                drawTicks: false,
              },
            },
          ],
        },
        elements: {
          line: {
            tension: 0,
          },
          point: {
            radius: 0,
          },
        },
      }
    },
  },
}
</script>

<style lang="sass" scoped></style>
