import type { PDFDocumentProxy } from 'pdfjs-dist'
import { getDocument } from 'pdfjs-dist'

export function isBase64(src: string) {
  const reg = /^data:.*;base64,/
  return reg.test(src)
}

export function generateLoadingTask(src: string) {
  const options = {
    enableXfa: true,
    cMapPacked: true,
    cMapUrl: 'pdfjs-dist/cmaps',
  }

  if (isBase64(src))
    return getDocument({ data: atob(src), ...options })

  else
    return getDocument({ url: src, ...options })
}

export async function loadPdf(src: string, processCallBack?: (loaded: number, total: number) => void): Promise<PDFDocumentProxy> {
  const loadingTask = generateLoadingTask(src)
  loadingTask.onProgress = (progressData: { loaded: number; total: number }) => {
    const { loaded, total } = progressData
    // Handle progress updates if needed
    processCallBack && processCallBack(loaded, total)
  }
  try {
    const pdfDocument = await loadingTask.promise
    return pdfDocument
  }
  catch (reason) {
    console.error(reason)
    throw reason // Optionally rethrow the error
  }
}

export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: number

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout)
        clearTimeout(timeout)

      timeout = setTimeout(() => resolve(func(...args)), waitFor)
    })
}
