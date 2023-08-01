## @xianjianlf2/vue-pdf-view

@xianjianlf2/vue-pdf-view is a npm library built on Pdf js, using the latest vite + vue3 + tailwind technologies. It supports virtual scrolling for smooth navigation in large PDF files and implements most features of pdf js, making it an ideal choice for handling PDF files in web applications.

![](https://img.shields.io/badge/version-0.1.1-blue)

### Additional features are being updated on an ongoing basis

## Feature

- [x] Jump To Page
- [x] Prev Page / Next Page
- [x] zoom in  / zoom out
- [x] find text (PdfViewerSearch Component)
- [ ] note

## usage


```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { PdfViewInstance } from '@xianjianlf2/vue-pdf-viewer'
import { PdfViewer } from '@xianjianlf2/vue-pdf-viewer'
import pdfUrl from './assets/pdf/922_towards_understanding_why_mask.pdf?url'
import '@xianjianlf2/vue-pdf-viewer/dist/style.css'

const showAllPage = ref(true)
const pdfViewerRef = ref<PdfViewInstance>()
// if use customer toolbar, it can get latest page num
function handleRendered() {
  pdfViewerRef.value?.getCurrenPageNum()
}
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
    <PdfViewer ref="pdfViewerRef" v-model:showAllPage="showAllPage" :src="pdfUrl" @rendered="handleRendered" />
  </div>
</template>

<style scoped></style>
```

## PdfViewerSearch

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { PdfViewerSearch } from '@xianjianlf2/vue-pdf-viewer'

import '@xianjianlf2/vue-pdf-viewer/style.css'
import pdfUrl from './assets/pdf/922_towards_understanding_why_mask.pdf?url'

/**
 * @description:
 * @param {src} {boolean}
 * @param {scale} {string}
 * @param {backgroundColor} {number} (optional)
 * @param {maxScale} {number} (optional)
 * @param {minScale} {number} (optional)
 * @param {scaleStep} {number} (optional)
 * @param {showSearchBar} {boolean} (optional)
 *
 * when press ctrl + f / cmd + f, focus on search input
 *
 */
</script>

<template>
  <div class="h-screen">
    <PdfViewerSearch :src="pdfUrl" />
  </div>
</template>

<style scoped></style>

```

