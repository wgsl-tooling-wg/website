<template>
  <footer
    v-if="!['cover', 'center'].includes($nav.currentLayout)"
    class="absolute bottom-1 left-0 right-0 px-4 flex justify-between text-sm text-gray-400 z-10"
  >
    <span></span>
    <span><a href="https://wesl-lang.dev/gdc-2026" class="text-gray-400 hover:text-gray-600 font-light no-underline">wesl-lang.dev/gdc-2026</a> &nbsp;&nbsp;&nbsp;&nbsp; <SlideCurrentNo /></span>
  </footer>
</template>
