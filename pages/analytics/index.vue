<template lang="pug">
.w-full
  .p-8
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
              td.px-2.py-3.text-center.text-xs {{ Math.floor(filterDisplayValues(index)[i + 1] / value * 10 * 100) / 10 }}%
</template>

<script>
import { analytics } from "@/fixtures"

export default {
  data() {
    return {
      analytics,
      currentDatasetsIndex: 0
    }
  },
  methods: {
    filterDisplayValues(index) {
      return this.analytics.datasets[index].values.filter((_, index) => index < this.dataValues.length - 1)
    },
    selectDatasets(index) {
      this.currentDatasetsIndex = index
    }
  },
  computed: {
    dataValues() {
      return this.analytics.datasets[this.currentDatasetsIndex].values
    },
    chartLabels() {
      return this.analytics.labels
    },
    displayValues() {
      return this.dataValues.filter((_, index) => index < this.dataValues.length - 1)
    },
    displayLabels() {
      return this.chartLabels.filter((_, index) => index < this.chartLabels.length - 1)
    },
    valuePercentage() {
      return this.dataValues.map((value, index) => Math.floor(this.dataValues[index + 1] / value * 10 * 100) / 10)
    },
    chartData() {
      return {
        datasets: [
          {
            data: this.dataValues,
            label: '候補者数'
          }
        ],
        labels: this.chartLabels
      }
    },
    options() {
      return {
        legend: {
          display: false,
        },
        labels: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawTicks: false
            }
          }],
        },
        elements: {
          line: {
            tension: 0
          },
          point: {
            radius: 0
          }
        },
      }
    },
  }
}
</script>

<style lang="sass" scoped>
</style>