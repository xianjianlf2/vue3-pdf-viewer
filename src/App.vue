<script setup lang="ts">
import { PdfViewerSearch } from '@xianjianlf2/vue-pdf-viewer'
import type { PdfViewerSearchConfig } from '@xianjianlf2/vue-pdf-viewer'
import '@xianjianlf2/vue-pdf-viewer/style.css'
import pdfUrl from './assets/pdf/922_towards_understanding_why_mask.pdf?url'

const pdfViewerSearchConfig: PdfViewerSearchConfig = {
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
</script>

<template>
  <div class="h-screen">
    <PdfViewerSearch :src="pdfUrl" :config="pdfViewerSearchConfig" />
  </div>
</template>

<style scoped></style>
