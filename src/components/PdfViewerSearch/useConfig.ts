export interface PdfViewerSearchConfig {
  scale?: {
    initScale?: number
    maxScale?: number
    minScale?: number
    scaleStep?: number
  }
  backgroundColor?: string
  singlePageMode?: boolean
  enableSearchBox?: boolean
  enableToolbar?: boolean
}

const defaultConfig: PdfViewerSearchConfig = {
  scale: {
    maxScale: 3.0,
    minScale: 0.5,
    scaleStep: 0.5,
  },
  backgroundColor: '#808080',
  singlePageMode: false,
  enableSearchBox: true,
  enableToolbar: true,
}

export function mergePdfViewerSearchConfig(config?: PdfViewerSearchConfig): PdfViewerSearchConfig {
  return {
    ...defaultConfig,
    ...config,
  }
}
