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
    v-data-table(
      :headers="table.headers"
      :items="table.datasets"
      hide-default-footer
      key-item="dataName"
    )
      template(v-slot:item="{ headers, item, index }")
        tr.cursor-pointer(@click="selectDatasets(index)")
          td(v-for="header in headers" :key="header.value") {{ item[header.value] }}
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
      currentDatasetsIndex: 0,
    }
  },
  methods: {
    filterDisplayValues(index) {
      return this.chart.datasets[index].values.filter(
        (_, index) => index < this.dataValues.length - 1
      )
    },
    selectDatasets(index) {
      console.log('hello')
      this.currentDatasetsIndex = index
    },
    dummyPlaceholder(value) {
      return !value ? 'text-gray-300' : ''
    },
  },
  computed: {
    dataValues() {
      return this.chart.datasets[this.currentDatasetsIndex].values
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

<style lang="sass" scoped></style>
