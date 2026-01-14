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

//stop point
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
  min-height: 900px;
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
  text-decoration: none;
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
  text-decoration: none;
}
.learn-btn:hover {
  transform: translateY(-2px);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  main {
    min-height: auto;
    padding: 1rem 0;
    gap: 1rem;
  }
  .page {
    flex-direction: column;
    width: 100%;
    padding: 0 1rem;
  }
  .left-content {
    flex: none;
    padding: 1rem;
    text-align: center;
    gap: 1rem;
    order: 1;
    margin-top: -1.5rem;
  }
  .right-content {
    flex: none;
    height: 200px;
    order: -1;
  }
  h1 {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1.2rem;
  }
  .description {
    font-size: 1rem;
  }
  .cta-buttons {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  .explore-btn, .learn-btn {
    width: 100%;
    max-width: 300px;
    font-size: 1rem;
  }
}
</style>
