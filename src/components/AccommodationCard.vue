<template>
  <article class="acc-card" @click="$emit('view', accommodation)">
    <img class="thumb" :src="accommodation.image" :alt="accommodation.title" loading="lazy" />
    <div class="body">
      <h3 class="title" :title="accommodation.title">{{ accommodation.title }}</h3>
      <div class="metadata">
        <span class="type">{{ accommodation.type }}</span>
        <span class="location">{{ accommodation.location }}</span>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

type Accom = {
  id: number | string
  title: string
  location?: string
  type?: string
  image?: string
  short?: string
}

defineProps<{ accommodation: Accom }>()
</script>

<style scoped>
.acc-card {
  display: flex;
  flex-direction: column;
  height: 280px;
  min-width: 280px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform .2s ease, box-shadow .2s ease;
  cursor: pointer;
}

.acc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #16a3fc;
}

.thumb {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.body {
  padding: 1rem 1.25rem;
  gap: 0.75rem;
  flex: 1;
}

.title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.metadata {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.type {
  color: #16a3fc;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}

.location {
  color: #666;
  font-size: 0.85rem;
  margin: 0;
}

/* clamp long text to keep card heights consistent */
.title, .type, .location {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (min-width: 900px) {
  .acc-card {
    height: 300px;
    min-width: 300px;
  }

  .thumb {
    height: 180px;
  }
}
</style>
