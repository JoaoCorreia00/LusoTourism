<script lang="ts" setup>
import ImageSlider from '../components/ImageSlider.vue'
import { ref } from 'vue'

const images = ref<string[]>([
  'Img_slider_1.jpg',
  'Img_slider_2.jpg',
  'Img_slider_3.jpg',
  'Img_slider_4.jpg',
  'Img_slider_5.jpg',
])
</script>

<template>
  <main>
    <div class="page">
      <div class="left-content">
        <h1>Bem-vindo ao LusoTourism</h1>
        <p class="subtitle">Descubra os Tesouros Escondidos de Portugal</p>
        <p class="description">
          Experimente a rica cultura, paisagens deslumbrantes e hospitalidade calorosa de Portugal.
          Desde cidades históricas até praias imaculadas, deixe-nos guiá-lo através de uma jornada inesquecível.
        </p>
        <div class="cta-buttons">
          <router-link to="/accommodations" class="explore-btn">Explorar Alojamentos</router-link>
          <router-link to="/casinos" class="learn-btn">Ver Casinos & Bingos</router-link>
        </div>
      </div>
      <div class="right-content">
        <ImageSlider :images="images" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 900px;
  background-color: #42b98300;
  display: flex;
  justify-content: center;
  gap: 2rem;
  
}
.page{
  width: 94%;
  display: flex;
  justify-content: center;
}
.left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
}
.right-content {
  flex: 1;
  display: flex;
  align-items: center;
}
h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin: 0;
}
.subtitle {
  font-size: 1.5rem;
  color: #16a3fc;
  margin: 0;
}
.description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}
img {
  width: 100%;
  height: 90%;
  padding: 1rem;
  object-fit: cover;
  border-radius: 20px;
}
.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.explore-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  background-color: #16a3fc;
  color: white;
  border: none;
}
.explore-btn:hover {
  transform: translateY(-2px);
}
.learn-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  background-color: transparent;
  color: #16a3fc;
  border: 2px solid #16a3fc;
}
.learn-btn:hover {
  transform: translateY(-2px);
}
</style>
