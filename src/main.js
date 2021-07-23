import { createApp } from 'vue'
import App from './App.vue'
import './utils/js/china'

const app = createApp(App)
console.log(app)
// app.config.globalProperties.$echarts = echarts
// app.config.globalProperties.$axios = axios;  //this.Axios
createApp(App).mount("#app")
