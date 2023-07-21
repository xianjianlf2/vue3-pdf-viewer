## @xianjianlf2/vue-pdf-view

@xianjianlf2/vue-pdf-view is a npm library built on Pdf js, using the latest vite + vue3 + tailwind technologies. It supports virtual scrolling for smooth navigation in large PDF files and implements most features of pdf js, making it an ideal choice for handling PDF files in web applications.

## Feature

- [x] Jump To Page
- [x] Prev Page / Next Page
- [x] zoom in  / zoom out
- [ ] find text
- [ ] note

## usage


```vue
<script setup lang="ts">
import { ref } from 'vue'

import { PdfViewer } from '@xianjianlf2/vue-pdf-viewer'
import '@xianjianlf2/vue-pdf-viewer/dist/style.css'
import pdfUrl from './assets/pdf/922_towards_understanding_why_mask.pdf?url'

const showAllPage = ref(true)

/**
 * @description:
 * @param {showAllPage} {boolean}
 * @param {pdfUrl} {string}
 * @param {scale} {number} (optional)
 * @param {scaleStep} {number} (optional)
 * @param {maxScale} {number} (optional)
 * @param {minScale} {number} (optional)
 * @param {showToolbar} {boolean} (optional)
 *
 * event:
 * @onProgress {function} (optional) (loadFileProcess: number)
 *
 * ref: PDFViewerRef.value.xxx
 * @params {jumpToPage} {function} (optional) (page: number)
 * @params {prevPage} {function} (optional)
 * @params {nextPage} {function} (optional)
 * @params {zoomIn} {function} (optional)
 * @params {zoomOut} {function} (optional)
 * @params {getCurrenPageNum} {function} (optional)
 * @params {getScale} {function} (optional)
 * @params {getTotalPageNum} {function} (optional)
 *
 */
</script>

<template>
  <div class="h-screen">
    <PdfViewer v-model:showAllPage="showAllPage" :src="pdfUrl" />
  </div>
</template>

<style scoped></style>
```
