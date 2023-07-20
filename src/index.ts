import type { App } from 'vue'
import PdfViewer from './components/PdfViewer.vue'

export { PdfViewer }

export default {
  install: (app: App) => {
    app.component('PdfViewer', PdfViewer)
  },
}
