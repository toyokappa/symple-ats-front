<template lang="pug">
.w-full
  .p-8
    .relative
      .absolute.flex.w-full
        .flex-1.p-3(v-for="(value, index) in displayValues" :key="index")
          .text-gray-500 {{ chartLabels[index] }}
          .text-2xl.font-bold {{ value }}
          .font-bold.text-gray-500(v-if="index < displayValues.length - 1")
            span.text-base.mr-px {{ valuePercentage[index] }}
            span.text-xs %
      line-chart(:chartData="chartData" :options="options" :height="200")
</template>

<script>
export default {
  data() {
    return {
      dataValues: [60, 36, 15, 10, 6, 6],
      chartLabels: ['書類選考', '1次面接', '2次面接', '内定', '内定承諾', '']
    }
  },
  computed: {
    displayValues() {
      return this.dataValues.filter((_, index) => index < this.dataValues.length - 1)
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