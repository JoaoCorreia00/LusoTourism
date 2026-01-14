<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { getAccommodationsDetails } from '../services/accommodations'

const route = useRoute()
const router = useRouter()

const api = route.params.api as 'et' | 'ea'
const pageAccommodations = ref<'et' | 'ea'>(api || 'et')
const idType = api === 'et' ? "NrRNET" : "NrRNAL"

const id = route.params.id as string

const loading = ref(true)
const error = ref('')
const accommodationDetails = ref(null as any)

// Fetch accommodation details on component mount
onMounted(async () => {
  try {
    const response = await getAccommodationsDetails(pageAccommodations.value, id)
    if (response.features && response.features.length > 0 && response.features[0]) {
      accommodationDetails.value = response.features[0]!.attributes
      
      const type = api === 'et' ? accommodationDetails.value.TipologiaET : accommodationDetails.value.Modalidade
      accommodationDetails.value.image = '/LusoTourism/'+type!.replace("/", "")+'.jpg'
      accommodationDetails.value.type
    } else {
      error.value = 'Alojamento não encontrado'
    }
  } catch (err) {
    error.value = 'Erro ao carregar os detalhes do alojamento'
    console.error('Error fetching accommodation details:', err)
  } finally {
    loading.value = false
  }
})

const starCount = computed(() => {
  if (!accommodationDetails.value?.Categoria) return 0
  return parseInt(accommodationDetails.value.Categoria.split(' ')[0]) || 0
})

const formattedOpeningDate = computed(() => {
  const dateValue = accommodationDetails.value?.[api === 'et' ? 'DataTituloValAbert' : 'DataAberturaPublico']
  if (!dateValue) return 'N/A'
  const date = new Date(dateValue)
  return date.toLocaleDateString('pt-PT')
})

const goBack = () => {
  router.push({ name: 'Accommodations' })
}
</script>

<template>
  <section class="page">
    <header>
      <div class="pageLink">
        <router-link to="/">Inicio</router-link>
        <p>/</p>
        <router-link to="/accommodations">Alojamentos</router-link>
        <p>/</p>
        <h1>{{ accommodationDetails?.Denominacao || 'A carregar...' }}</h1>
      </div>
      <button class="back-btn" @click="goBack">← Voltar</button>
    </header>

    <div class="loading-container" v-if="loading">
      <div class="loading-spinner">A carregar alojamento...</div>
    </div>
    <div class="error-container" v-else-if="error">
      <div class="error-message">{{ error }}</div>
    </div>
    <div class="details-container" v-else-if="accommodationDetails">
      <!-- Hero Section with Image -->
      <div class="hero-section">
        <img :src="accommodationDetails.image" :alt="accommodationDetails.Denominacao" class="hero-image" />
        <div class="hero-overlay">
          <h2>{{ accommodationDetails.Denominacao }}</h2>
          <p class="location">{{ accommodationDetails.Endereco }}, {{ accommodationDetails.Concelho }}</p>
        </div>
      </div>

      <!-- Main Info Grid -->
      <div class="info-grid">
        <!-- Basic Information Card -->
        <div class="info-card">
          <h3>Informação Básica</h3>
          <div class="info-row">
            <span class="label">Número {{ idType }}:</span>
            <span class="value">{{ accommodationDetails[api === 'et' ? 'NrRNET' : 'NrRNAL'] }}</span>
          </div>
          <div class="info-row">
            <span class="label">Denominação:</span>
            <span class="value">{{ accommodationDetails.Denominacao }}</span>
          </div>
          <div class="info-row">
            <span class="label">Tipologia:</span>
            <span class="value">{{ accommodationDetails[api === 'et' ? 'TipologiaET' : 'Modalidade'].replace(/([A-Z])/g, ' $1').trim() }}</span>
          </div>
          <div v-if="api === 'ea'" class="info-row">
            <span class="label">Utentes:</span>
            <span class="value">{{ accommodationDetails.NrUtentes }}</span>
          </div>
          <div class="info-row" v-if="api === 'et'">
            <span class="label">Categoria:</span>
            <div v-if="starCount > 0" class="stars">
              <span v-for="star in starCount" :key="star" class="star">★</span>
            </div>
            <div v-else class="value">{{ "N/A" }}</div>
          </div>
          <div class="info-row">
            <span class="label">Data de Abertura:</span>
            <span class="value">{{ formattedOpeningDate }}</span>
          </div>
          <div class="info-row">
            <span class="label">Selo Clean & Safe:</span>
            <span class="value badge" :class="{ 'badge-yes': accommodationDetails.SeloCleanSafe === 'Sim' }">
              {{ accommodationDetails.SeloCleanSafe }}
            </span>
          </div>
        </div>

        <!-- Capacity Information Card -->
        <div v-if="api === 'et'" class="info-card">
          <h3>Capacidade</h3>
          <div class="info-row">
            <span class="label">Unidades de Alojamento:</span>
            <span class="value">{{ accommodationDetails.NrUnidAloj }}</span>
          </div>
          <div class="info-row">
            <span class="label">Camas Fixas:</span>
            <span class="value">{{ accommodationDetails.NrCamasFixas }}</span>
          </div>
          <div class="info-row">
            <span class="label">Quartos:</span>
            <span class="value">{{ accommodationDetails.NrQuartos }}</span>
          </div>
          <div class="info-row">
            <span class="label">Suites:</span>
            <span class="value">{{ accommodationDetails.NrSuites }}</span>
          </div>
          <div class="info-row">
            <span class="label">Apartamentos:</span>
            <span class="value">{{ accommodationDetails.NrApart }}</span>
          </div>
          <div class="info-row">
            <span class="label">Moradias:</span>
            <span class="value">{{ accommodationDetails.NrMoradias }}</span>
          </div>
          <div class="info-row">
            <span class="label">Campistas:</span>
            <span class="value">{{ accommodationDetails.NrCampistas }}</span>
          </div>
        </div>

        <!-- Facilities Card -->
        <div v-if="api === 'et'" class="info-card">
          <h3>Instalações e Serviços</h3>
          <div class="info-row">
            <span class="label">Campo de Golfe:</span>
            <span class="value badge" :class="{ 'badge-yes': accommodationDetails.CampoGolfe === 'Sim' }">
              {{ accommodationDetails.CampoGolfe }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">Salas de Reuniões:</span>
            <span class="value badge" :class="{ 'badge-yes': accommodationDetails.SalasReunioes === 'Sim' }">
              {{ accommodationDetails.SalasReunioes }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">Capacidade Salas:</span>
            <span class="value">{{ accommodationDetails.CapacSalasReunioes }} pessoas</span>
          </div>
          <div class="info-row">
            <span class="label">SPA:</span>
            <span class="value badge" :class="{ 'badge-yes': accommodationDetails.SPA === 'Sim' }">
              {{ accommodationDetails.SPA }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">Outros Equipamentos:</span>
            <span class="value">{{ accommodationDetails.OutrosEquip ? accommodationDetails.OutrosEquip : 'N/A' }}</span>
          </div>
        </div>

        <!-- Tourism Complex Card -->
        <div v-if="api === 'et'" class="info-card">
          <h3>Complexo Turístico</h3>
          <div class="info-row">
            <span class="label">Integra Conjunto Turístico:</span>
            <span class="value badge" :class="{ 'badge-yes': accommodationDetails.IntegraCT && accommodationDetails.IntegraCT !== 'NaoIntegra' }">
              {{ accommodationDetails.IntegraCT && accommodationDetails.IntegraCT !== 'NaoIntegra' ? 'Sim' : 'Não' }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">Designação Conjunto:</span>
            <span class="value">{{ accommodationDetails.IntegraCT && accommodationDetails.IntegraCT !== 'NaoIntegra' ? accommodationDetails.DesignacaoCT : 'N/A' }}</span>
          </div>
        </div>

        <!-- Contact Information Card -->
        <div class="info-card">
          <h3>Contacto</h3>
          <div v-if="api === 'et'" class="info-row">
            <span class="label">Website:</span>
            <a v-if="accommodationDetails.Website" :href="`https://${accommodationDetails.Website}`" target="_blank" class="value link">
              {{ accommodationDetails.Website }}
            </a>
            <a v-else>N/A</a>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <a v-if="accommodationDetails.Email" :href="`mailto:${accommodationDetails.Email}`" class="value link">
              {{ accommodationDetails.Email }}
            </a>
            <a v-else>N/A</a>
          </div>
        </div>

        <!-- Location Information Card -->
        <div class="info-card">
          <h3>Localização</h3>
          <div class="info-row">
            <span class="label">Endereço:</span>
            <span class="value">{{ accommodationDetails.Endereco }}</span>
          </div>
          <div class="info-row">
            <span class="label">Concelho:</span>
            <span class="value">{{ accommodationDetails.Concelho }}</span>
          </div>
          <div class="info-row">
            <span class="label">Distrito:</span>
            <span class="value">{{ accommodationDetails.Distrito }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  width: 100%;
  min-height: 100vh;
}

header {
  width: 94%;
  padding: 1rem;
  margin: 0 auto 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pageLink {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

.pageLink h1 {
  margin: 0;
  padding-left: 0.5rem;
  color: rgb(0, 0, 0);
  font-size: 1.5rem;
}

.pageLink p {
  margin: 0;
  padding: 0 0.5rem;
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

.back-btn {
  padding: 0.5rem 1.5rem;
  background: #16a3fc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.back-btn:hover {
  background: #1385d4;
}

.loading-container {
  width: 94%;
  margin: 0 auto;
  padding: 2rem;
}

.details-container {
  width: 94%;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  padding: 2rem;
}

.hero-overlay h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: bold;
}

.hero-overlay .location {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #16a3fc;
  color: #16a3fc;
  font-size: 1.4rem;
  font-weight: bold;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row.full-width {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

.value {
  color: #333;
  font-size: 1rem;
  text-align: right;
}

.info-row.full-width .value {
  text-align: left;
}

.link {
  color: #16a3fc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #1385d4;
  text-decoration: underline;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

.badge-yes {
  background: #4caf50;
  color: white;
}

.value.badge:not(.badge-yes) {
  background: #f44336;
  color: white;
}

.stars {
  display: flex;
  justify-content: flex-end;
}

.star {
  color: #FFD700;
  font-size: 1.2em;
  margin: 0 0.1em;
}

@media (max-width: 1200px) {
  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .hero-section {
    height: 300px;
  }

  .hero-overlay h2 {
    font-size: 1.8rem;
  }

  .hero-overlay .location {
    font-size: 1rem;
  }

  header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .back-btn {
    width: 100%;
  }
}

.error-container {
  width: 94%;
  margin: 0 auto;
  padding: 2rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #f44336;
  background-color: #ffebee;
  border-radius: 8px;
  border: 1px solid #ffcdd2;
}
</style>
