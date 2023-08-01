import type { App } from 'vue'
import './style.css'
import { PdfViewer, PdfViewerSearch } from './components/'

export * from './components/'

export default {
  install: (app: App) => {
    app.component(PdfViewer.name, PdfViewer)
    app.component(PdfViewerSearch.name, PdfViewerSearch)
  },
}
