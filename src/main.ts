import { createApp } from 'vue'
import './style.css'
import { RecycleScroller } from 'vue-virtual-scroller'
import App from './App.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { PDFViewer } from '@/components'

const app = createApp(App)

export type RecycleScrollerType = InstanceType<typeof RecycleScroller>
app.component('PDFViewer', PDFViewer)
app.component('RecycleScroller', RecycleScroller)
app.mount('#app')
