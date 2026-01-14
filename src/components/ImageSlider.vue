<template>
  <div
    class="slider"
    :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
    @mouseenter="pause"
    @mouseleave="endDrag; play"
    tabindex="0"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mousemove="drag"
    @touchmove="drag"
    @mouseup="endDrag"
    @touchend="endDrag"
  >
    <div class="slides">
      <div
        v-for="(img, i) in images"
        :key="i"
        class="slide"
        :class="{ active: i === index }"
        aria-hidden="true"
      >
        <img :src="img" :alt="`slide-${i}`" loading="lazy" />
      </div>
    </div>

    <button class="nav prev" @click="prev" aria-label="Previous">‹</button>
    <button class="nav next" @click="next" aria-label="Next">›</button>

    <div class="dots">
      <button
        v-for="(_, i) in images"
        :key="i"
        :class="{ active: i === index }"
        @click="go(i)"
        :aria-label="`Go to slide ${i+1}`"
      ></button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  images: string[]
  interval?: number
}>()

const index = ref(0)
const timer = ref<number | null>(null)
const interval = props.interval ?? 6000
const isDragging = ref(false)
const startX = ref(0)

function next() {
  index.value = (index.value + 1) % props.images.length
}

function prev() {
  index.value = (index.value - 1 + props.images.length) % props.images.length
}

function go(i: number) {
  index.value = i
}

function play() {
  stopTimer()
  timer.value = window.setInterval(next, interval)
}

function stopTimer() {
  if (timer.value !== null) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function pause() {
  stopTimer()
}

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  startX.value = getClientX(e)
  pause()
}

function drag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  e.preventDefault()
}

function endDrag(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  const endX = getClientX(e)
  const delta = startX.value - endX
  if (Math.abs(delta) > 50) {
    if (delta > 0) next()
    else prev()
  }
  isDragging.value = false
  play()
}

function getClientX(e: MouseEvent | TouchEvent): number {
  if (e instanceof MouseEvent) return e.clientX
  const touch = e.touches[0] || (e as TouchEvent).changedTouches[0]
  return touch ? touch.clientX : 0
}

onMounted(() => {
  play()
})

onBeforeUnmount(() => {
  stopTimer()
})

// keep index in range if images array changes
watch(() => props.images.length, (len) => {
  if (index.value >= len) index.value = 0
})
</script>

<style scoped>
.slider { position: relative; width: 100%; height: 90%; overflow: hidden; border-radius: 20px; }
.slides { display: flex; width: 100%; height: 100%; }
.slide { position: absolute; inset: 0; opacity: 0; transition: opacity .45s ease; }
.slide.active { opacity: 1; position: relative; }
.slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.35); color: #fff; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
.nav.prev { left: 12px }
.nav.next { right: 12px }
.nav:hover { background: rgba(0,0,0,0.5) }
.dots { position: absolute; left: 50%; transform: translateX(-50%); bottom: 12px; display: flex; gap: 8px; }
.dots button { width: 10px; height: 10px; background: rgba(255,255,255,0.6); border: none; border-radius: 50%; padding: 0; cursor: pointer; }
.dots button.active { background: rgba(255,255,255,0.95); width: 12px; height: 12px; }

@media (max-width: 768px) {
  .nav{
    display: none;
  }
}
</style>
