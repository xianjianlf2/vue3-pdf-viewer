<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker?url'
import { isBase64 } from '@/utils'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  scale: {
    type: Number,
    default: 1.0,

  },
})

GlobalWorkerOptions.workerSrc = PdfWorker
const canvasRef = ref<HTMLCanvasElement>()

function generateLoadingTask(src: string) {
  if (isBase64(src))
    return getDocument({ data: atob(src) })

  else
    return getDocument({ url: src })
}

async function loadPdf() {
  if (!canvasRef.value)
    return console.warn('canvasRef is not defined')

  const loadingTask = generateLoadingTask(props.src)

  const pdfDocument = await loadingTask.promise

  // Fetch the first page
  const pdfPage = await pdfDocument.getPage(1)
  const viewport = pdfPage.getViewport({ scale: props.scale })
  // Support HiDPI-screens.
  const outputScale = window.devicePixelRatio || 1
  const width = Math.floor(viewport.width * outputScale)
  const height = Math.floor(viewport.height * outputScale)

  canvasRef.value.width = width
  canvasRef.value.height = height
  canvasRef.value.style.width = `${Math.floor(viewport.width)}px`
  canvasRef.value.style.height = `${Math.floor(viewport.height)}px`

  const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined
  const context = canvasRef.value.getContext('2d')!

  const renderContext = {
    canvasContext: context,
    transform,
    viewport,
  }

  pdfPage.render(renderContext)
}

onMounted(loadPdf)
</script>

<template>
  <canvas ref="canvasRef" />
</template>

<style scoped></style>
