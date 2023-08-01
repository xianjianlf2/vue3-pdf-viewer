<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRaw, watch } from 'vue'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker?url'
import { EventBus, PDFFindController, PDFLinkService, PDFSinglePageViewer } from 'pdfjs-dist/web/pdf_viewer'
import { Icon } from '@iconify/vue'
import { debounce, loadPdf } from '../../utils'
import 'pdfjs-dist/web/pdf_viewer.css'
import { useKeyboardEvent } from './useKeyboardEvent'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  scale: {
    type: Number,
    default: 1.5,
  },
  backgroundColor: {
    type: String,
    default: '#808080',
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
  showSearchBar: {
    type: Boolean,
    default: true,
  },
})

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
const { searchBoxRef, registerKeyboardEvent, unregisterKeyboardEvent } = useKeyboardEvent()
const searchBoxInputElement = ref<HTMLInputElement>()
const searchResultRef = ref<SearchResult>({
  current: 0,
  total: 0,
})
const searchKeyword = ref('')
const showEmptyResult = computed(() => searchResultRef.value.total === 0 || searchKeyword.value === '')

interface SearchResult {
  current: number
  total: number
}
function usePdfViewer(container: HTMLDivElement) {
  const eventBus = new EventBus()
  const pdfLinkService = new PDFLinkService({ eventBus })
  const findController = new PDFFindController({ eventBus, linkService: pdfLinkService })
  const pdfViewer = new PDFSinglePageViewer({
    container,
    eventBus,
    linkService: pdfLinkService,
    findController,
  })

  pdfLinkService.setViewer(pdfViewer)

  eventBus.on('pagesinit', handlePagesInit)
  eventBus.on('updatefindmatchescount', handleUpdateFindMatchesCount)
  eventBus.on('updatefindcontrolstate', handleUpdateFindMatchesCount)

  function handlePagesInit() {
    pdfViewer.currentScaleValue = 'page-width'
  }

  function handleUpdateFindMatchesCount({ matchesCount }: { matchesCount: SearchResult }) {
    searchResultRef.value = matchesCount
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
  pdfDocument.value = document
  eventBusRef.value = eventBus
  findControllerRef.value = findController
}

onMounted(() => {
  initPdfView()
  props.showSearchBar && registerKeyboardEvent()
})

onUnmounted(() => {
  props.showSearchBar && unregisterKeyboardEvent()
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
  const eventBus = toRaw(eventBusRef.value)
  eventBus?.dispatch('find', {
    type,
    query,
    phraseSearch: true,
    caseSensitive: false,
    highlightAll: true,
    findPrevious,
  })
}
</script>

<template>
  <div class="h-full relative" :style="{ backgroundColor }">
    <div
      ref="searchBoxRef" class="flex items-center border border-gray-300 rounded-lg p-2 absolute bg-gray-700 right-8"
      style="z-index: 999;"
    >
      <div class="rounded-lg overflow-hidden flex gap-2 items-center">
        <input
          ref="searchBoxInputElement" v-model="searchKeyword" type="text" placeholder="search"
          class="flex-grow px-2 py-1 focus:outline-none" @keydown.enter="search"
        >
        <div>
          <span v-if="!showEmptyResult" class="text-white ml-1 text-sm">{{ `${searchResultRef?.current} of
                      ${searchResultRef?.total}` }}</span>
          <span v-if="showEmptyResult" class="ml-1 text-white text-sm">No results</span>
        </div>
        <div>
          <button class=" hover:bg-gray-600 text-white px-4 py-1" @click="handlePreviousMatch">
            <Icon icon="material-symbols:arrow-upward-alt-rounded" />
          </button>
          <button class="hover:bg-gray-600 text-white px-4 py-1" @click="handleNextMatch">
            <Icon icon="material-symbols:arrow-downward-alt" />
          </button>
          <button class="hover:bg-gray-600 text-white px-4 py-1">
            <Icon icon="material-symbols:close" />
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
