## @xianjianlf2/vue-pdf-view

@xianjianlf2/vue-pdf-view is a powerful npm library built on Pdf js, using the latest vite + vue3 + tailwind technologies. It supports virtual scrolling for smooth navigation in large PDF files and implements most features of pdf js, making it an ideal choice for handling PDF files in web applications.

## usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import PDFViewer from './components/PDFViewer.vue'
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
  <PDFViewer v-model:showAllPage="showAllPage" :src="pdfUrl" />
</template>

<style scoped></style>

```
