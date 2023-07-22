<script setup lang="ts">
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
import { DynamicScroller } from 'vue-virtual-scroller'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker?url'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import { SingleView } from '../'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  scale: {
    type: Number,
    default: 1.5,
  },
  showAllPage: {
    type: Boolean,
    default: true,
  },
  maxScale: {
    type: Number,
    default: 3.0,
  },
  minScale: {
    type: Number,
    default: 0.5,
  },
  scaleStep: {
    type: Number,
    default: 0.5,
  },
  backgroundColor: {
    type: String,
    default: '#9CA3AF',
  },
  showToolbar: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['onProgress', 'update:showAllPage', 'rendered'])

defineExpose({
  jumpToPage,
  prevPage,
  nextPage,
  zoomIn,
  zoomOut,
  getCurrenPageNum,
  getScale,
  getTotalPageNum,
})

// default page to view
const PAGE_TO_VIEW = 1
// set pdf worker
GlobalWorkerOptions.workerSrc = PdfWorker

const scaleRef = ref(props.scale)
const pdfDocument = ref<PDFDocumentProxy>()
const currentPageNum = ref(PAGE_TO_VIEW)
const totalPageNum = ref(0)
const { buttonGroup } = useButtonGroup()
const scrollContainerRef = ref<HTMLDivElement>()

const itemHeight = ref(300)
const bufferHeight = ref()
const renderList = ref<{ id: number }[]>([])

const showAllPageRef = computed({
  get: () => props.showAllPage,
  set: (value) => {
    emit('update:showAllPage', value)
    nextTick(() => {
      initRenderList()
    })
  },
})

watch(() => props.src, () => {
  initializePage()
})

onMounted(initializePage)

async function initializePage() {
  await loadPage(props.src)

  if (!checkDocumentLoaded())
    return

  await getItemHeight()
  initRenderList()
}

function useButtonGroup() {
  const buttonGroup = [{
    name: 'zoom in',
    handler: zoomIn,
  }, {
    name: 'zoom out',
    handler: zoomOut,
  }, {
    name: 'prev page',
    handler: prevPage,
  }, {
    name: 'next page',
    handler: nextPage,
  }]
  return { buttonGroup }
}

function generateLoadingTask(src: string) {
  if (isBase64(src))
    return getDocument({ data: atob(src) })

  else
    return getDocument({ url: src })
}

function isBase64(src: string) {
  const reg = /^data:.*;base64,/
  return reg.test(src)
}

async function loadPage(src: string) {
  const loadingTask = generateLoadingTask(src)
  loadingTask.onProgress = (progressData: { loaded: number; total: number }) => {
    const { loaded, total } = progressData
    emit('onProgress', (loaded / total * 100).toFixed(2))
  }
  try {
    pdfDocument.value = await loadingTask.promise
  }
  catch
  (reason) {
    console.error(reason)
  }
}

function checkDocumentLoaded() {
  return !!pdfDocument.value?.numPages
}

function initRenderList() {
  if (showAllPageRef.value) {
    renderList.value = Array.from({ length: pdfDocument.value!.numPages }, (_, i) => {
      return {
        id: i + 1,
      }
    })
  }
  else {
    renderList.value = [{
      id: PAGE_TO_VIEW,
    }]
  }
}
type DynamicScrollerType = InstanceType<typeof DynamicScroller>
function updateScrollPosition(currentPage: number) {
  (scrollContainerRef.value! as DynamicScrollerType).$el.scrollTop = (currentPage - 1) * itemHeight.value
}

function singlePageChange(pageNum: number) {
  renderList.value = [{
    id: pageNum,
  }]
}
function updatePageNumber(newPageNumber: number) {
  const { numPages } = pdfDocument.value!
  if (newPageNumber >= 1 && newPageNumber <= numPages) {
    currentPageNum.value = newPageNumber
    return true
  }
  return false
}

function changePage(increment: number, isJump = false) {
  const newPageNumber = isJump ? increment : currentPageNum.value + increment
  if (!updatePageNumber(newPageNumber))
    return

  const updateFunction = showAllPageRef.value ? updateScrollPosition : singlePageChange
  nextTick(() => updateFunction(currentPageNum.value))
}

function prevPage() {
  changePage(-1)
}

function nextPage() {
  changePage(1)
}

function zoomIn() {
  if (scaleRef.value > props.maxScale)
    scaleRef.value = props.maxScale
  else
    scaleRef.value += props.scaleStep
  getItemHeight()
}

function zoomOut() {
  if (scaleRef.value <= props.minScale)
    scaleRef.value = props.minScale
  else
    scaleRef.value -= props.scaleStep
  getItemHeight()
}

function jumpToPage(num: number) {
  changePage(num, true)
}

async function getItemHeight() {
  const pdfDoc = toRaw(pdfDocument.value)
  const page = await pdfDoc!.getPage(1)
  totalPageNum.value = pdfDoc!.numPages

  const outputScale = window.devicePixelRatio || 1
  const viewport = page.getViewport({ scale: scaleRef.value })
  const height = Math.floor(viewport.height * outputScale)

  itemHeight.value = height
  // current page index
  bufferHeight.value = Math.floor(height * 0.5)
}

function getCurrenPageNum() {
  return currentPageNum.value
}

function getScale() {
  return scaleRef.value
}

function getTotalPageNum() {
  return totalPageNum.value
}

function handleUpdate(_startIndex: number, _endIndex: number, _visibleStartIndex: number, _visibleEndIndex: number) {
  if (!showAllPageRef.value)
    return
  currentPageNum.value = _visibleEndIndex
  emit('rendered')
}
</script>

<template>
  <div v-if="showToolbar">
    <div class="flex items-center justify-center">
      <button v-for="button in buttonGroup" :key="button.name" class="border rounded-lg p-2 bg-gray-500 text-white" @click="button.handler">
        {{ button.name }}
      </button>
    </div>
    <div class="flex items-center justify-center gap-2">
      <span>{{ `${currentPageNum} / ${totalPageNum}` }}</span>
      <input id="checkbox" v-model="showAllPageRef" type="checkbox">
      <label for="checkbox">Show All Page</label>
    </div>
  </div>

  <div class="h-full" :style="{ backgroundColor }">
    <DynamicScroller
      v-if="pdfDocument"
      ref="scrollContainerRef" v-slot="{ item }" :min-item-size="itemHeight" :items="renderList" key-field="id"
      :update-interval="300" :emit-update="true" :buffer="bufferHeight"
      :style="{ height: `${itemHeight}px` }"
      @update="handleUpdate"
    >
      <div class="justify-center flex">
        <SingleView :pdf-doc="toRaw(pdfDocument)" :page-num="item.id" :scale="scaleRef" />
      </div>
    </DynamicScroller>
  </div>
</template>
