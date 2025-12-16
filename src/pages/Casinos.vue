<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Utility function to chunk arrays
function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, (i + 1) * size))
}

// Carousel state
const casinoCurrentSlide = ref(0)
const bingoCurrentSlide = ref(0)

// Container refs
const casinoContainer = ref<HTMLElement>()
const bingoContainer = ref<HTMLElement>()

// Responsive cards per slide
const casinoSlides = computed(() => chunkArray(casinos, getCardsPerSlide(casinoContainer.value)))
const bingoSlides = computed(() => chunkArray(bingos, getCardsPerSlide(bingoContainer.value)))

// Navigation functions
const navigate = (slidesLength: number, direction: number, currentIndex: number) =>
  (currentIndex + direction + slidesLength) % slidesLength

const casinoNext = () => {
  casinoCurrentSlide.value = navigate(casinoSlides.value.length, 1, casinoCurrentSlide.value)
}
const casinoPrev = () => {
  casinoCurrentSlide.value = navigate(casinoSlides.value.length, -1, casinoCurrentSlide.value)
}
const bingoNext = () => {
  bingoCurrentSlide.value = navigate(bingoSlides.value.length, 1, bingoCurrentSlide.value)
}
const bingoPrev = () => {
  bingoCurrentSlide.value = navigate(bingoSlides.value.length, -1, bingoCurrentSlide.value)
}

function getCardsPerSlide(container: HTMLElement | undefined): number {
  if (!container) return 4 // fallback

  const containerWidth = container.clientWidth - 60
  const cardWidth = 390 // card width + some padding + gap
  const calculated = Math.floor(containerWidth / cardWidth)

  if(calculated < 1) return 1
  return calculated
}

// Update slides on resize
let resizeTimeout: number
const updateSlides = () => {
  // Debounce resize events
  clearTimeout(resizeTimeout)
  resizeTimeout = window.setTimeout(() => {
    // Force recomputation by triggering reactivity
    casinoSlides.value
    bingoSlides.value
  }, 100)
}

onMounted(() => {
  window.addEventListener('resize', updateSlides)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSlides)
  clearTimeout(resizeTimeout)
})

// Sample data representing casino and bingo venues
const casinos = [
  { id: 1, denominacao: 'Luzeiro Casino', lotacao: 500, maquinas: 200, jogosBancados: true, salaEspetaculos: true, salaReunioesCongressos: true, restaurantes: 2, bares: 1, website: 'https://example1.com', endereco: 'Rua 1, 1000', localidadeCP: 'Lisboa, 1000-001', freguesia: 'Belém', concelho: 'Lisboa', distrito: 'Lisboa' },
  { id: 2, denominacao: 'Oura Casino', lotacao: 300, maquinas: 150, jogosBancados: false, salaEspetaculos: true, salaReunioesCongressos: false, restaurantes: 1, bares: 0, website: 'https://example2.com', endereco: 'Avenida 2, 2000', localidadeCP: 'Porto, 2000-002', freguesia: 'Cedofeita', concelho: 'Porto', distrito: 'Porto' },
  { id: 3, denominacao: 'Royal Casino', lotacao: 400, maquinas: 180, jogosBancados: true, salaEspetaculos: false, salaReunioesCongressos: true, restaurantes: 3, bares: 2, website: 'https://example3.com', endereco: 'Praça 3, 3000', localidadeCP: 'Faro, 3000-003', freguesia: 'Sé', concelho: 'Faro', distrito: 'Faro' },
  { id: 4, denominacao: 'Vila Praia Casino', lotacao: 350, maquinas: 120, jogosBancados: false, salaEspetaculos: true, salaReunioesCongressos: false, restaurantes: 2, bares: 1, website: 'https://example4.com', endereco: 'Rua 4, 4000', localidadeCP: 'Albufeira, 4000-004', freguesia: 'Albufeira', concelho: 'Albufeira', distrito: 'Faro' },
  { id: 5, denominacao: 'Casino Estoril', lotacao: 600, maquinas: 250, jogosBancados: true, salaEspetaculos: true, salaReunioesCongressos: true, restaurantes: 4, bares: 3, website: 'https://example5.com', endereco: 'Av 5, 5000', localidadeCP: 'Estoril, 5000-005', freguesia: 'Cascais', concelho: 'Cascais', distrito: 'Lisboa' },
  { id: 6, denominacao: 'Casino da Madeira', lotacao: 450, maquinas: 190, jogosBancados: true, salaEspetaculos: false, salaReunioesCongressos: true, restaurantes: 3, bares: 2, website: 'https://example6.com', endereco: 'Praça 6, 6000', localidadeCP: 'Funchal, 6000-006', freguesia: 'Funchal', concelho: 'Funchal', distrito: 'Madeira' },
  { id: 7, denominacao: 'Casino do Algarve', lotacao: 320, maquinas: 140, jogosBancados: false, salaEspetaculos: true, salaReunioesCongressos: false, restaurantes: 1, bares: 1, website: 'https://example7.com', endereco: 'Rua 7, 7000', localidadeCP: 'Tavira, 7000-007', freguesia: 'Tavira', concelho: 'Tavira', distrito: 'Faro' },
]

const bingos = [
  { id: 1, denominacao: 'Central Bingo', lotacao: 200, salaEspetaculos: true, restaurantes: 1, bares: 0, website: 'https://bingo1.com', endereco: 'Rua 4, 4000', localidadeCP: 'Lisboa, 4000-004', freguesia: 'Misericórdia', concelho: 'Lisboa', distrito: 'Lisboa' },
  { id: 2, denominacao: 'Porto Bingo', lotacao: 150, salaEspetaculos: false, restaurantes: 0, bares: 1, website: 'https://bingo2.com', endereco: 'Av 5, 5000', localidadeCP: 'Porto, 5000-005', freguesia: 'Paranhos', concelho: 'Porto', distrito: 'Porto' },
  { id: 3, denominacao: 'Algarve Bingo', lotacao: 100, salaEspetaculos: true, restaurantes: 1, bares: 1, website: 'https://bingo3.com', endereco: 'Praça 6, 6000', localidadeCP: 'Faro, 6000-006', freguesia: 'Monte Gordo', concelho: 'Monte Gordo', distrito: 'Faro' }
]
</script>

<template>
  <section class="page">
    <!-- Navigation Breadcrumb -->
    <header>
      <div class="pageLink">
        <router-link to="/">Inicio</router-link>
        <p>/</p>
        <h1>Casinos & Bingos</h1>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h2 class="hero-title">Discover premier gaming destinations across Portugal</h2>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">{{ casinos.length }}</span>
            <span class="stat-label">Casinos</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ bingos.length }}</span>
            <span class="stat-label">Bingos</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Casinos Section -->
    <section class="venue-section">
      <header class="section-header">
        <h2 class="section-title">Casinos</h2>
        <p class="section-description">Experience world-class gaming entertainment</p>
      </header>

      <div class="carousel-wrapper">
        <div class="carousel-container" ref="casinoContainer">
          <div class="carousel" :style="{ transform: `translateX(-${casinoCurrentSlide * 100}%)` }">
            <div v-for="(slide, slideIndex) in casinoSlides" :key="slideIndex" class="slide">
              <div class="items-grid">
                <article v-for="casino in slide" :key="casino.id" class="venue-card">
                  <div class="card-image">
                    <img :src="'/src/assets/Img_slider_1.jpg'" :alt="casino.denominacao">
                    <div class="card-overlay">
                      <div class="game-type">Casino</div>
                    </div>
                  </div>
                  <div class="card-content">
                    <h3 class="venue-name">{{ casino.denominacao }}</h3>
                    <div class="venue-location">
                      <span class="location-icon">📍</span>
                      <span>{{ casino.concelho }}, {{ casino.distrito }}</span>
                    </div>
                    <div class="venue-features">
                      <div class="feature-item">
                        <strong>Capacity:</strong> {{ casino.lotacao }}
                      </div>
                      <div class="feature-item">
                        <strong>Machines:</strong> {{ casino.maquinas }}
                      </div>
                      <div class="feature-item">
                        <strong>Dining:</strong> {{ casino.restaurantes }} Restaurants
                      </div>
                    </div>
                    <a :href="casino.website" target="_blank" class="venue-button">View Details</a>
                  </div>
                </article>
              </div>
            </div>
          </div>
          <button class="nav-btn nav-prev" @click="casinoPrev" :disabled="casinoSlides.length <= 1">‹</button>
          <button class="nav-btn nav-next" @click="casinoNext" :disabled="casinoSlides.length <= 1">›</button>
        </div>

        <div class="carousel-indicators">
          <button
            v-for="(_, i) in casinoSlides"
            :key="i"
            :class="['indicator', { active: i === casinoCurrentSlide }]"
            @click="casinoCurrentSlide = i"
          />
        </div>
      </div>
    </section>

    <!-- Bingos Section -->
    <section class="venue-section">
      <header class="section-header">
        <h2 class="section-title">Bingos</h2>
        <p class="section-description">Find traditional bingo halls and modern gaming venues</p>
      </header>

      <div class="carousel-wrapper">
        <div class="carousel-container" ref="bingoContainer">
          <div class="carousel" :style="{ transform: `translateX(-${bingoCurrentSlide * 100}%)` }">
            <div v-for="(slide, slideIndex) in bingoSlides" :key="slideIndex" class="slide">
              <div class="items-grid">
                <article v-for="bingo in slide" :key="bingo.id" class="venue-card">
                  <div class="card-image">
                    <img :src="'/src/assets/Img_slider_1.jpg'" :alt="bingo.denominacao">
                    <div class="card-overlay">
                      <div class="game-type">Bingo</div>
                    </div>
                  </div>
                  <div class="card-content">
                    <h3 class="venue-name">{{ bingo.denominacao }}</h3>
                    <div class="venue-location">
                      <span class="location-icon">📍</span>
                      <span>{{ bingo.concelho }}, {{ bingo.distrito }}</span>
                    </div>
                    <div class="venue-features">
                      <div class="feature-item">
                        <strong>Capacity:</strong> {{ bingo.lotacao }}
                      </div>
                      <div class="feature-item">
                        <strong>Show Room:</strong> {{ bingo.salaEspetaculos ? 'Yes' : 'No' }}
                      </div>
                      <div class="feature-item">
                        <strong>Dining:</strong> {{ bingo.restaurantes }} Restaurants
                      </div>
                    </div>
                    <a :href="bingo.website" target="_blank" class="venue-button">View Details</a>
                  </div>
                </article>
              </div>
            </div>
          </div>
          <button class="nav-btn nav-prev" @click="bingoPrev" :disabled="bingoSlides.length <= 1">‹</button>
          <button class="nav-btn nav-next" @click="bingoNext" :disabled="bingoSlides.length <= 1">›</button>
        </div>

        <div class="carousel-indicators">
          <button
            v-for="(_, i) in bingoSlides"
            :key="i"
            :class="['indicator', { active: i === bingoCurrentSlide }]"
            @click="bingoCurrentSlide = i"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.page {
  width: 100%;
  min-height: 100vh;
}

.pageLink {
  width: 94%;
  padding: 1rem;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pageLink h1 {
  margin: 0;
  padding-left: 0.5rem;
  color: rgb(0, 0, 0);
  font-size: 1.5rem;
}

.pageLink p {
  margin: 0;
  padding-left: 0.5rem;
  color: rgb(0, 0, 0);
  font-size: 1.3rem;
}

.pageLink a {
  margin: 0;
  padding-left: 0.5rem;
  color: rgb(0, 0, 0);
  font-size: 1.3rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.pageLink a:hover {
  color: #16a3fc;
}

/* Hero Section */
.hero {
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 2rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: #16a3fc;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
  color: #666;
}

/* Venue Sections */
.venue-section {
  width: 94%;
  margin: 0 auto 4rem;
  padding-bottom: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #16a3fc;
  margin: 0 0 1rem;
}

.section-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

.carousel-wrapper {
  position: relative;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.carousel-container {
  position: relative;
  width: 94%;
  overflow: hidden;
  border-radius: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 0 25px;
}

.carousel {
  display: flex;
  width: 100%;
  transition: transform 0.5s ease;
}

.slide {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.items-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Venue Cards */
.venue-card {
  flex: 0 0 360px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.venue-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #16a3fc;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.venue-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
}

.game-type {
  background: #16a3fc;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 1.25rem;
}

.venue-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem;
  line-height: 1.3;
}

.venue-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.location-icon {
  font-size: 1.1rem;
}

.venue-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #555;
  padding: 0.25rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-item strong {
  color: #333;
  font-weight: 600;
}

.venue-button {
  display: inline-block;
  width: 100%;
  padding: 0.75rem 0;
  background: #16a3fc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #16a3fc;
}

.venue-button:hover {
  background: #0e86d4;
  border-color: #0e86d4;
}

/* Navigation */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.nav-btn:hover {
  background: #16a3fc;
  color: white;
  border-color: #16a3fc;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-prev { left: 20px; }
.nav-next { right: 20px; }

/* Carousel Indicators */
.carousel-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ddd;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #16a3fc;
  width: 14px;
  height: 10px;
  border-radius: 5px;
}

.indicator:hover {
  background: #16a3fc;
}

</style>
