<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { fetchCasinos, type Casino } from '../services/casinos'
import { fetchBingos, type Bingo } from '../services/casinos'

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

// Drag state
const casinoIsDragging = ref(false)
const bingoIsDragging = ref(false)
const casinoStartX = ref(0)
const bingoStartX = ref(0)

const showFilters = ref(true)
const isDesktop = ref(true)
const isMobile = ref(false)

// Responsive cards per slide
const casinoSlides = computed(() => chunkArray(casinos.value, getCardsPerSlide(casinoContainer.value)))
const bingoSlides = computed(() => chunkArray(bingos.value, getCardsPerSlide(bingoContainer.value)))

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
  if (isMobile.value) return 1

  if (!container) return 4 // fallback

  const containerWidth = container.clientWidth - 60
  const cardWidth = 390 // card width + some padding + gap
  const calculated = Math.floor(containerWidth / cardWidth)

  if(calculated < 1) return 1
  return calculated
}

function getClientX(e: MouseEvent | TouchEvent): number {
  if (e instanceof MouseEvent) return e.clientX
  const touch = e.touches[0] || (e as TouchEvent).changedTouches[0]
  return touch ? touch.clientX : 0
}

const casinoStartDrag = (e: MouseEvent | TouchEvent) => {
  casinoIsDragging.value = true
  casinoStartX.value = getClientX(e)
}

const casinoDrag = (e: MouseEvent | TouchEvent) => {
  if (!casinoIsDragging.value) return
  e.preventDefault()
}

const casinoEndDrag = (e: MouseEvent | TouchEvent) => {
  if (!casinoIsDragging.value) return
  const endX = getClientX(e)
  const delta = casinoStartX.value - endX
  if (Math.abs(delta) > 50) {
    if (delta > 0) casinoNext()
    else casinoPrev()
  }
  casinoIsDragging.value = false
}

const bingoStartDrag = (e: MouseEvent | TouchEvent) => {
  bingoIsDragging.value = true
  bingoStartX.value = getClientX(e)
}

const bingoDrag = (e: MouseEvent | TouchEvent) => {
  if (!bingoIsDragging.value) return
  e.preventDefault()
}

const bingoEndDrag = (e: MouseEvent | TouchEvent) => {
  if (!bingoIsDragging.value) return
  const endX = getClientX(e)
  const delta = bingoStartX.value - endX
  if (Math.abs(delta) > 50) {
    if (delta > 0) bingoNext()
    else bingoPrev()
  }
  bingoIsDragging.value = false
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

onMounted(async () => {
  isMobile.value = window.innerWidth < 768
  isDesktop.value = window.innerWidth >= 768
  showFilters.value = isDesktop.value
  window.addEventListener('resize', updateSlides)
  await loadCasinos()
  await loadBingos()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSlides)
  clearTimeout(resizeTimeout)
})

// Reactive data
const casinos = ref<Casino[]>([])
const bingos = ref<Bingo[]>([])

// Loading and error states
const loading = ref(false)
const loadingBingo = ref(false)
const error = ref<string | null>(null)
const errorBingo = ref<string | null>(null)

// Fetch casinos data
const loadCasinos = async () => {
  loading.value = true
  error.value = null
  try {
    const resp = await fetchCasinos()
    casinos.value = resp.features.map(item => ({
      denominacao: item.attributes.Denominacao,
      jogosBancados: item.attributes.JogosBancados,
      salaEspetaculos: item.attributes.SalaEspetaculos,
      salaReunioesCongressos: item.attributes.SalaReunioesCongressos,
      restaurantes: item.attributes.Restaurantes,
      bares: item.attributes.Bares,
      website: item.attributes.Website ? (item.attributes.Website.startsWith('http') ? item.attributes.Website : `https://${item.attributes.Website}`) : '',
      localidadeCP: item.attributes.LocalidadeCP,
      concelho: item.attributes.Concelho,
      distrito: item.attributes.Distrito,
      codigoPostal: item.attributes.CodigoPostal,
    }))
  } catch (err) {
    error.value = 'Failed to load casinos data'
    console.error('Error loading casinos:', err)
  } finally {
    loading.value = false
  }
}

const loadBingos = async () => {
  loadingBingo.value = true
  errorBingo.value = null
  try {
    const resp = await fetchBingos()
    bingos.value = resp.features.map(item => ({
      denominacao: item.attributes.Denominacao,
      lotacao: item.attributes.Lotacao,
      salaEspetaculos: item.attributes.SalaEspetaculos,
      restaurantes: item.attributes.Restaurantes,
      bares: item.attributes.Bares,
      website: item.attributes.Website ? (item.attributes.Website.startsWith('http') ? item.attributes.Website : `https://${item.attributes.Website}`) : '',
      localidadeCP: item.attributes.LocalidadeCP,
      concelho: item.attributes.Concelho,
      distrito: item.attributes.Distrito,
      codigoPostal: item.attributes.CodigoPostal,
    }))
  } catch (err) {
    errorBingo.value = 'Failed to load bingos data'
    console.error('Error loading bingos:', err)
  } finally {
    loadingBingo.value = false
  }
}

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
        <h2 class="hero-title">Descubra destinos de jogos de primeira classe em Portugal</h2>
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
        <p class="section-description">Experimente entretenimento de jogos de classe mundial</p>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <p>A carregar casinos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="loadCasinos" class="retry-button">Tentar Novamente</button>
      </div>

      <!-- Casinos Content -->
      <div v-else class="carousel-wrapper">
        <div class="carousel-container" ref="casinoContainer" @mousedown="casinoStartDrag" @touchstart="casinoStartDrag" @mousemove="casinoDrag" @touchmove="casinoDrag" @mouseup="casinoEndDrag" @touchend="casinoEndDrag" :style="{ cursor: casinoIsDragging ? 'grabbing' : 'grab' }">
          <div class="carousel" :style="{ transform: `translateX(-${casinoCurrentSlide * 100}%)` }">
            <div v-for="(slide, slideIndex) in casinoSlides" :key="slideIndex" class="slide">
              <div class="items-grid">
                <article v-for="casino in slide" class="venue-card">
                  <div class="card-image">
                    <img :src="casino.codigoPostal+'.jpg'" :alt="casino.denominacao">
                    <div class="card-overlay">
                      <div class="game-type">Casino</div>
                    </div>
                  </div>
                  <div class="card-content">
                    <h3 class="venue-name">{{ casino.denominacao }}</h3>
                    <div class="venue-location">
                      <span class="location-icon">📍</span>
                      <span v-if="casino.concelho">{{ casino.concelho }}, {{ casino.distrito }}</span>
                      <span v-else>{{ casino.localidadeCP }}</span>
                    </div>
                    <div class="venue-features">
                      <div class="games-section">
                        <h4>Jogos Disponíveis</h4>
                        <div class="games-tags">
                          <span v-for="game in (casino.jogosBancados || '').split(',')" :key="game" class="game-tag">{{ game.trim() }}</span>
                        </div>
                      </div>
                      <div class="facilities">
                        <div v-if="casino.salaEspetaculos == 'Sim'" class="facility-badge">Sala de Espetáculos</div>
                        <div v-if="casino.salaReunioesCongressos == 'Sim'" class="facility-badge">Sala de Reuniões</div>
                        <div v-if="casino.restaurantes == 'Sim'" class="facility-badge">Restaurantes</div>
                        <div v-if="casino.bares == 'Sim'" class="facility-badge">Bares</div>
                      </div>
                    </div>
                    <a :href="casino.website" target="_blank" class="venue-button">Ver Detalhes</a>
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
        <p class="section-description">Encontre salas de bingo tradicionais e locais de jogos modernos</p>
      </header>

      <!-- Loading State -->
      <div v-if="loadingBingo" class="loading-container">
        <p>A carregar bingos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorBingo" class="error-container">
        <p>{{ errorBingo }}</p>
        <button @click="loadBingos" class="retry-button">Tentar Novamente</button>
      </div>

      <div class="carousel-wrapper">
        <div class="carousel-container" ref="bingoContainer" @mousedown="bingoStartDrag" @touchstart="bingoStartDrag" @mousemove="bingoDrag" @touchmove="bingoDrag" @mouseup="bingoEndDrag" @touchend="bingoEndDrag" :style="{ cursor: bingoIsDragging ? 'grabbing' : 'grab' }">
          <div class="carousel" :style="{ transform: `translateX(-${bingoCurrentSlide * 100}%)` }">
            <div v-for="(slide, slideIndex) in bingoSlides" :key="slideIndex" class="slide">
              <div class="items-grid">
                <article v-for="bingo in slide" class="venue-card">
                  <div class="card-image">
                    <img :src="''+bingo.codigoPostal+'.jpg'" :alt="bingo.denominacao">
                    <img :src="'Img_slider_1.jpg'" :alt="bingo.denominacao">
                    <div class="card-overlay">
                      <div class="game-type">Bingo</div>
                    </div>
                  </div>
                  <div class="card-content">
                    <h3 class="venue-name">{{ bingo.denominacao }}</h3>
                    <div class="venue-location">
                      <span class="location-icon">📍</span>
                      <span v-if="bingo.concelho">{{ bingo.concelho }}, {{ bingo.distrito }}</span>
                      <span v-else>{{ bingo.localidadeCP }}</span>
                    </div>
                    <div class="venue-features">
                      <div class="capacity-section">
                        <h4 v-if="bingo.lotacao">Capacidade: <span class="capacity-value">{{ bingo.lotacao }} pessoas</span></h4>
                      </div>
                      <p>Instalações Disponíveis</p>
                      <div class="facilities">
                        <div v-if="bingo.salaEspetaculos == 'Sim'" class="facility-badge">Sala de Espetáculos</div>
                        <div v-if="bingo.restaurantes == 'Sim'" class="facility-badge">Restaurantes</div>
                        <div v-if="bingo.bares == 'Sim'" class="facility-badge">Bares</div>
                      </div>
                    </div>
                    <a v-if="bingo.website && bingo.website !== 'https://não possui site'" :href="bingo.website" target="_blank" class="venue-button">Ver Detalhes</a>
                    <a v-else target="_blank" class="venue-button">Não Disponível</a>
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
  padding: 0 10px;
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
  height: 550px;
  display: flex;
  flex-direction: column;
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
  height: 200px;
  object-fit: cover;
  display: block;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  overflow: hidden;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  overflow-y: auto;
}

.games-section h4,
.capacity-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.venue-features p {
  margin: 0 0 -0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.games-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.game-tag {
  background: #f0f8ff;
  color: #16a3fc;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #16a3fc;
}

.capacity-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.facilities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.facility-badge {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #4caf50;
}



.venue-button {
  flex-shrink: 0;
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

/* Loading and Error States */
.loading-container,
.error-container {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
}

.loading-container p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.error-container p {
  font-size: 1.1rem;
  color: #d32f2f;
  margin: 0 0 1rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: #16a3fc;
  color: white;
  border: 1px solid #16a3fc;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #0e86d4;
  border-color: #0e86d4;
}

@media (max-width: 768px) {

  .pageLink {
    width: 95%;
    padding: 0.75rem;
    margin-bottom: -0.25rem;
  }

  .pageLink h1 {
    font-size: 1.2rem;
  }

  .pageLink p, .pageLink a {
    font-size: 1rem;
  }

  .hero {
    padding: 3rem 1rem;
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-stats {
    gap: 2rem;
  }

  .venue-section {
    width: 90%;
    margin: 0 auto 3rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .section-description {
    font-size: 1rem;
  }

  .venue-card {
    flex: 0 0 320px;
    height: 500px;
  }

  .card-image {
    height: 180px;
  }

  .card-image img {
    height: 180px;
  }

  .venue-name {
    font-size: 1.1rem;
  }

  .venue-location {
    font-size: 0.85rem;
  }

  .venue-features {
    gap: 0.75rem;
  }

  .games-section h4,
  .capacity-section h4,
  .venue-features p {
    font-size: 0.9rem;
  }

  .games-tags {
    gap: 0.4rem;
  }

  .game-tag,
  .facility-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }

  .nav-btn {
    display: none;
  }
  
}

@media (max-width: 480px) {
  .hero {
    padding: 2rem 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat {
    padding: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .venue-section {
    width: 95%;
    margin: 0 auto 2rem;
    padding-bottom: 1rem;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-description {
    font-size: 0.9rem;
  }

  .venue-card {
    flex: 0 0 300px;
    height: 450px;
  }

  .card-image {
    height: 150px;
  }

  .card-image img {
    height: 150px;
  }

  .card-content {
    padding: 1rem;
  }

  .venue-name {
    font-size: 1rem;
  }

  .venue-location {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }

  .venue-features {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .games-section h4,
  .capacity-section h4,
  .venue-features p {
    font-size: 0.85rem;
  }

  .capacity-value {
    font-size: 1rem;
  }

  .venue-button {
    padding: 0.6rem 0;
    font-size: 0.9rem;
  }

  .carousel-container {
    width: 95%;
    padding: 0 10px;
  }

  .slide {
    padding: 1.5rem 0;
  }

  .items-grid {
    gap: 1rem;
  }
}

</style>
