<script setup lang="ts">
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type { PropType } from 'vue'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  pdfDoc: {
    type: Object as PropType<PDFDocumentProxy>,
    required: true,
  },
  pageNum: {
    type: Number,
    required: true,
  },
  scale: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['rendered'])

const canvasRef = ref<HTMLCanvasElement>()
const pageRendering = ref(false)
const pageNumPending = ref<null | number>(null)

watch(() => props.pageNum, (val) => {
  queueRenderPage(val)
})
watch(() => props.scale, () => {
  queueRenderPage(props.pageNum)
})
watch(() => props.pdfDoc, () => {
  queueRenderPage(1)
})

function checkCanvasRef() {
  return !!canvasRef.value
}
async function renderPage(pageNum: number) {
  if (!checkCanvasRef())
    return
  const canvas: HTMLCanvasElement = canvasRef.value!
  pageRendering.value = true
  const page = await props.pdfDoc.getPage(pageNum)
  // Support HiDPI-screens.
  const outputScale = window.devicePixelRatio || 1
  const viewport = page.getViewport({ scale: props.scale })

  const context = canvas.getContext('2d')!

  canvas.height = Math.floor(viewport.height * outputScale)
  canvas.width = Math.floor(viewport.width * outputScale)
  canvas.style.width = `${Math.floor(viewport.width)}px`
  canvas.style.height = `${Math.floor(viewport.height)}px`
  const renderContext = {
    canvasContext: context,
    viewport,
  }
  // renderTask
  const renderTask = page.render(renderContext)
  await renderTask.promise
  pageRendering.value = false
  emit('rendered')

  if (pageNumPending.value !== null) {
    renderPage(pageNumPending.value)
    pageNumPending.value = null
  }
}

function queueRenderPage(num: number) {
  if (pageRendering.value)
    pageNumPending.value = num

  else
    renderPage(num)
}

onMounted(() => {
  renderPage(props.pageNum)
})
</script>

<template>
  <canvas ref="canvasRef" />
</template>

<style scoped>

</style>
