<template lang="pug">
.px-8.py-4
  .chart-area.mb-3
    .chart-text-area
      .chart-text.pa-3(v-for="(value, index) in displayValues" :key="index")
        .grey--text.mb-2 {{ chartLabels[index] }}
        .text-h5.font-weight-bold.mb-1 {{ value }}
        .grey--text(v-if="index < displayValues.length - 1")
          template(v-if="isNaN(valuePercentage[index])")
            span.text-h6.font-weight-bold -
          template(v-else)
            span.text-h6.font-weight-bold.percent-value {{ valuePercentage[index] }}
            span.text-overline.font-weight-bold %
    line-chart(:chartData="chartData" :options="options" :height="150")
  v-data-table(
    :headers="table.headers"
    :items="table.datasets"
    hide-default-footer
    key-item="dataName"
  )
    template(v-slot:item="{ headers, item }")
      tr.cursor-pointer(
        :class="{ 'grey lighten-3': currentDataName === item.dataName }"
        @click="selectDatasets(item.dataName)"
      )
        td(v-for="header in headers"
        :key="header.value"
        :class="{ 'text-center': header.align === 'center' }"
      ) {{ item[header.value] }}
</template>

<script>
export default {
  layout: 'signedIn',
  async asyncData({ $axios, $auth }) {
    const orgId = $auth.user.organization.uniqueId
    const { data: analytics } = await $axios.get(`/${orgId}/analytics`)
    const { data: positionList } = await $axios.get(`/${orgId}/positions`)
    return {
      chart: analytics.chart,
      table: analytics.table,
      positionList,
    }
  },
  data() {
    return {
      filter: {
        section: '',
        position: '',
      },
      currentDataName: '全体',
    }
  },
  methods: {
    filterDisplayValues(index) {
      return this.chart.datasets[index].values.filter(
        (_, index) => index < this.dataValues.length - 1
      )
    },
    selectDatasets(dataName) {
      this.currentDataName = dataName
    },
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
  },
  computed: {
    dataValues() {
      return this.chart.datasets.find(
        (dataset) => dataset.dataName === this.currentDataName
      ).values
    },
    chartLabels() {
      return this.chart.labels
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
      return this.chart.datasets.map((data) => data.dataName)
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

<style lang="sass" scoped>
.chart-area
  position: relative
  .chart-text-area
    position: absolute
    display: flex
    width: 100%
    .chart-text
      flex: 1 1 0%
      div, span
        line-height: 1 !important
      .percent-value
        margin-right: 1px
</style>
