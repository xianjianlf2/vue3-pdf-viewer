<script setup lang="ts">
import PDFViewer from './components/PDFViewer.vue'
import pdfUrl from './assets/pdf/helloworld.pdf?url'
</script>

<template>
  <PDFViewer :src="pdfUrl" />
</template>

<style scoped></style>
