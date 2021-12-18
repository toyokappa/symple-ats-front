import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

vSelect.props.components.default = () => ({
  Deselect: {
    render: () => '',
  },
  OpenIndicator: {
    render: () => '',
  },
})

Vue.component('v-select', vSelect)
