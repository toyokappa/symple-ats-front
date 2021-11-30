<template lang="pug">
.w-full
  .p-8.h-screen
    line-chart(:chartData="chartData" :options="options" :height="200")
</template>

<script>
export default {
  data() {
    return {
      dataValues: [10, 5, 4, 4, 3, 3],
      chartLabels: ['書類選考', '1次面接', '2次面接', '内定', '内定承諾', '']
    }
  },
  computed: {
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
        scales: {
          xAxes: [{
          }],
          yAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false
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

<style lang="sass">
</style>