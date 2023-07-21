import type { App } from 'vue'
import PdfViewer from './components/Viewer.vue'
import './style.css'

export { PdfViewer }

export default {
  install: (app: App) => {
    app.component('PdfViewer', PdfViewer)
  },
}
