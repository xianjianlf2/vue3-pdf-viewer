<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, onMounted, onUnmounted, ref, toRaw, watch } from 'vue'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker?url'
import { EventBus, PDFFindController, PDFLinkService, PDFSinglePageViewer, PDFViewer } from 'pdfjs-dist/web/pdf_viewer'
import { Icon } from '@iconify/vue'
import { debounce, loadPdf } from '../../utils'
import 'pdfjs-dist/web/pdf_viewer.css'
import { useKeyboardEvent } from './useKeyboardEvent'
import type { PdfViewerSearchConfig } from './useConfig'
import { mergePdfViewerSearchConfig } from './useConfig'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  config: {
    type: Object as PropType<PdfViewerSearchConfig>,
  },

})

const emit = defineEmits(['updateFindMatchCount'])

defineExpose({
  search,
  handlePreviousMatch,
  handleNextMatch,
})

GlobalWorkerOptions.workerSrc = PdfWorker

const viewerContainerRef = ref<HTMLDivElement>()
const pdfDocument = ref()
const findControllerRef = ref()
const eventBusRef = ref<EventBus>()
const pdfViewerRef = ref<PDFViewer>()
const { searchBoxRef, registerKeyboardEvent, unregisterKeyboardEvent, closeSearchBox } = useKeyboardEvent()
const searchBoxInputElement = ref<HTMLInputElement>()
const searchResultRef = ref<SearchResult>({
  current: 0,
  total: 0,
})
const searchKeyword = ref('')
const showEmptyResult = computed(() => searchResultRef.value.total === 0 || searchKeyword.value === '')
const viewerConfig = computed(() => mergePdfViewerSearchConfig(props.config))
const isHighlightAll = ref(true)
const isCaseSensitive = ref(false)
const currentScale = ref()

interface SearchResult {
  current: number
  total: number
}
function createPDFViewer(container: HTMLDivElement, eventBus: EventBus, linkService: PDFLinkService, findController: PDFFindController) {
  if (viewerConfig.value.singlePageMode)
    return new PDFSinglePageViewer({ container, eventBus, linkService, findController })
  else return new PDFViewer({ container, eventBus, linkService, findController })
}

function usePdfViewer(container: HTMLDivElement) {
  const eventBus = new EventBus()
  const pdfLinkService = new PDFLinkService({ eventBus })
  const findController = new PDFFindController({ eventBus, linkService: pdfLinkService })
  const pdfViewer = createPDFViewer(container, eventBus, pdfLinkService, findController)

  pdfLinkService.setViewer(pdfViewer)

  // register event
  eventBus.on('pagesinit', handlePagesInit)
  eventBus.on('updatefindmatchescount', handleUpdateFindMatchesCount)
  eventBus.on('updatefindcontrolstate', handleUpdateFindMatchesCount)

  function handlePagesInit() {
    const initScale = props.config?.scale?.initScale
    pdfViewer.currentScaleValue = initScale ? initScale.toString() : 'page-width'
    // set current scale
    currentScale.value = pdfViewer.currentScale
    currentScale.value = currentScale.value.toFixed(2)
  }

  function handleUpdateFindMatchesCount({ matchesCount }: { matchesCount: SearchResult }) {
    searchResultRef.value = matchesCount
    emit('updateFindMatchCount', matchesCount)
  }

  return {
    pdfViewer,
    eventBus,
    pdfLinkService,
    findController,
  }
}

async function initPdfView() {
  const { eventBus, pdfLinkService, pdfViewer, findController } = usePdfViewer(viewerContainerRef.value!)
  const document = await loadPdf(props.src)
  if (!document)
    return
  // load document
  pdfViewer.setDocument(document)
  pdfLinkService.setDocument(document, null)
  // expose to outer
  pdfViewerRef.value = pdfViewer
  pdfDocument.value = document
  eventBusRef.value = eventBus
  findControllerRef.value = findController
}

onMounted(() => {
  initPdfView()
  viewerConfig.value.enableSearchBox && registerKeyboardEvent()
})

onUnmounted(() => {
  viewerConfig.value.enableSearchBox && unregisterKeyboardEvent()
})

function search() {
  const keyword = searchBoxInputElement.value?.value
  searchKeyword.value = keyword ?? ''
  if (!keyword)
    return
  dispatchFindEvent('find', {
    query: keyword,
    findPrevious: false,
  })
}

const debouncedSearch = debounce(search, 500)
watch(searchKeyword, debouncedSearch)

function handlePreviousMatch() {
  dispatchFindEvent('again', {
    query: searchKeyword.value,
    findPrevious: true,
  })
}

function handleNextMatch() {
  dispatchFindEvent('again', {
    query: searchKeyword.value,
    findPrevious: false,
  })
}

function dispatchFindEvent(type: string, { query, findPrevious = false }: { query: string; findPrevious?: boolean }) {
  // Uncaught TypeError: Cannot read from private field 'eventBus' without its containing object
  const eventBus = toRaw(eventBusRef.value)
  eventBus?.dispatch('find', {
    type,
    query,
    phraseSearch: true,
    caseSensitive: isCaseSensitive.value,
    highlightAll: isHighlightAll.value,
    findPrevious,
  })
}

function toggleHighlightAll() {
  isHighlightAll.value = !isHighlightAll.value
  dispatchFindEvent('find', {
    query: searchKeyword.value,
    findPrevious: false,
  })
}

function toggleCaseSensitive() {
  isCaseSensitive.value = !isCaseSensitive.value
  dispatchFindEvent('find', {
    query: searchKeyword.value,
    findPrevious: false,
  })
}

function handleZoomIn() {
  const { maxScale, scaleStep } = viewerConfig.value.scale!
  const scale = Math.min(Number(currentScale.value) + scaleStep!, maxScale!)
  const pdfViewer = toRaw(pdfViewerRef.value)
  pdfViewer && (pdfViewer.currentScaleValue = scale.toFixed(2).toString())
  currentScale.value = scale.toFixed(2)
}

function handleZoomOut() {
  const { minScale, scaleStep } = viewerConfig.value.scale!
  const scale = Math.max(Number(currentScale.value) - scaleStep!, minScale!)
  const pdfViewer = toRaw(pdfViewerRef.value)
  pdfViewer && (pdfViewer.currentScaleValue = scale.toFixed(2).toString())
  currentScale.value = scale.toFixed(2)
}

function zoomToFit() {
  const pdfViewer = toRaw(pdfViewerRef.value)
  if (!pdfViewer)
    return
  pdfViewer.currentScaleValue = 'page-width'
  currentScale.value = pdfViewer.currentScale.toFixed(2)
}
</script>

<template>
  <div class="h-full relative" :style="{ backgroundColor: viewerConfig.backgroundColor }">
    <div v-if="viewerConfig.enableToolbar" class="bg-gray-700 text-white flex justify-center items-center gap-1">
      <span class="bg-gray-500 p-1">{{ `${currentScale * 100} %` }}</span>
      <button title="zoom in" class="hover:bg-gray-600">
        <Icon icon="material-symbols:zoom-in-rounded" width="24" @click="handleZoomIn" />
      </button>
      <button title="zoom out" class="hover:bg-gray-600">
        <Icon icon="material-symbols:zoom-out" width="24" @click="handleZoomOut" />
      </button>
      <button title="zoom out" class="hover:bg-gray-600">
        <Icon icon="material-symbols:fit-screen" width="24" @click="zoomToFit" />
      </button>
    </div>
    <div
      ref="searchBoxRef" class="items-center border border-gray-300 rounded-lg p-2 absolute bg-gray-700 right-8 hidden"
      style="z-index: 999;"
    >
      <div class="rounded-lg overflow-hidden flex gap-2 items-center">
        <div class="relative flex items-center">
          <input
            ref="searchBoxInputElement" v-model="searchKeyword" type="text" placeholder="search"
            class="flex-grow px-2 py-1 focus:outline-none pr-16 bg-gray-500 text-white" @keydown.enter="search"
          >
          <div class="absolute right-0 flex gap-1 mr-1">
            <button title="Match Case" class="hover:bg-gray-600" @click="toggleCaseSensitive">
              <Icon icon="material-symbols:match-case" width="20" :color="isCaseSensitive ? 'yellow' : 'white'" />
            </button>
            <button title="Highlight All" class="hover:bg-gray-600" @click="toggleHighlightAll">
              <Icon icon="material-symbols:highlight-outline" width="20" :color="isHighlightAll ? 'yellow' : 'white'" />
            </button>
          </div>
        </div>
        <div>
          <span v-if="!showEmptyResult" class="text-white ml-1 text-sm">{{ `${searchResultRef?.current} of
                      ${searchResultRef?.total}` }}</span>
          <span v-if="showEmptyResult" class="ml-1 text-white text-sm">No results</span>
        </div>
        <div>
          <button class=" hover:bg-gray-600 text-white px-4 py-1" @click="handlePreviousMatch">
            <Icon icon="material-symbols:arrow-upward-alt-rounded" width="24" />
          </button>
          <button class="hover:bg-gray-600 text-white px-4 py-1" @click="handleNextMatch">
            <Icon icon="material-symbols:arrow-downward-alt" width="24" />
          </button>
          <button class="hover:bg-gray-600 text-white px-4 py-1" @click="closeSearchBox">
            <Icon icon="material-symbols:close" width="24" />
          </button>
        </div>
      </div>
    </div>
    <div id="viewerContainer" ref="viewerContainerRef" class="overflow-auto absolute w-full h-full">
      <div id="viewer" class="pdfViewer" />
    </div>
  </div>
</template>

<style scoped></style>
