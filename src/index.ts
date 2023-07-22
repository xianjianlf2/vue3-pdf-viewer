import type { App } from 'vue'
import './style.css'
import { PdfViewer } from './components/'

export * from './components/'

export default {
  install: (app: App) => {
    app.component(PdfViewer.name, PdfViewer)
  },
}
