<template>
  <footer
    v-if="!['cover', 'center'].includes($nav.currentLayout)"
    class="absolute bottom-1 right-2 text-sm text-gray-400 z-10"
  >
    <SlideCurrentNo />
  </footer>
</template>
