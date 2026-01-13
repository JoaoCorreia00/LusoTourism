<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import AccommodationCard from '../components/AccommodationCard.vue'
import { getAccommodationsPage, getAccommodationsCount, getUniqueDistricts, getUniqueTypes } from '../services/accommodations'
import { useRouter } from 'vue-router'

const router = useRouter()

type Accom = {
  id: string
  title: string
  location: string
  type: string
  image: string
}

const accommodations = ref<Accom[]>([])
const loading = ref(true)
const selectedDistrict = ref('')
const selectedType = ref('')
const selectedSort = ref('')
const savedApi = localStorage.getItem('selectedApi') as 'et' | 'ea' | null
const pageAccommodations = ref<'et' | 'ea'>(savedApi || 'et')

// Filter state - cache options per API to avoid refetching (persisted in localStorage)
const DISTRICT_CACHE_KEY = 'accommodations_districts'
const TYPE_CACHE_KEY = 'accommodations_types'
const COUNT_CACHE_KEY = 'accommodations_counts'

const districtOptionsCache = ref<Record<'et' | 'ea', string[]>>({
  et: JSON.parse(localStorage.getItem(`${DISTRICT_CACHE_KEY}_et`) || '[]'),
  ea: JSON.parse(localStorage.getItem(`${DISTRICT_CACHE_KEY}_ea`) || '[]')
})
const typeOptionsCache = ref<Record<'et' | 'ea', string[]>>({
  et: JSON.parse(localStorage.getItem(`${TYPE_CACHE_KEY}_et`) || '[]'),
  ea: JSON.parse(localStorage.getItem(`${TYPE_CACHE_KEY}_ea`) || '[]')
})

// Cache for total counts per filter combination to avoid unnecessary API calls
const countCache = ref<Record<string, number>>(JSON.parse(localStorage.getItem(COUNT_CACHE_KEY) || '{}'))

const districtOptions = computed(() => districtOptionsCache.value[pageAccommodations.value])
const typeOptions = computed(() => typeOptionsCache.value[pageAccommodations.value])

// pagination state
const pageSize = ref(28) // Items per page
const page = ref(1) // 1-based
const total = ref<number | null>(null)

const totalPages = computed(() => {
  return total.value ? Math.max(1, Math.ceil(total.value / pageSize.value)) : null
})

const visiblePages = computed<(number | string)[]>(() => {
  const tp = totalPages.value
  const cur = page.value
  if (!tp) return []
  if (tp <= 9) return Array.from({ length: tp }, (_, i) => i + 1)

  const pages: (number | string)[] = []
  pages.push(1)
  // show second page when close to start
  if (cur <= 4) {
    for (let i = 2; i <= Math.max(4, cur + 1); i++) pages.push(i)
    pages.push('...')
  } else {
    pages.push('...')
    const start = Math.max(2, cur - 1)
    const end = Math.min(tp - 1, cur + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < tp - 1) pages.push('...')
  }
  pages.push(tp)
  // dedupe and ensure numbers are in range
  return pages.filter((v, idx, arr) => arr.indexOf(v) === idx)
})

async function loadPage(p = 1, filters = { district: selectedDistrict.value, type: selectedType.value }, sortBy = selectedSort.value) {
  loading.value = true
  try {
    const offset = (p - 1) * pageSize.value
    const resp = await getAccommodationsPage(pageAccommodations.value, offset, pageSize.value, filters, sortBy)
    accommodations.value = resp.features.map(item => {
      const api = pageAccommodations.value
      const id = api === 'et' ? item.attributes.NrRNET : item.attributes.NrRNAL
      const type = api === 'et' ? item.attributes.TipologiaET : item.attributes.Modalidade
      return {
        id: id!,
        title: item.attributes.Denominacao,
        location: item.attributes.Concelho === item.attributes.Distrito ? item.attributes.Distrito : `${item.attributes.Concelho}, ${item.attributes.Distrito}`,
        image: type!.replace("/", "")+'.jpg',
        type: type!.replace(/([A-Z])/g, ' $1').trim(),
      }
    })

    // Fetch total count only if not cached or filters changed (sortBy doesn't affect count)
    const countKey = JSON.stringify({ api: pageAccommodations.value, district: filters.district, type: filters.type })
    if (countCache.value[countKey] !== undefined) {
      total.value = countCache.value[countKey]
    } else {
      try {
        const count = await getAccommodationsCount(pageAccommodations.value, filters)
        total.value = count
        countCache.value[countKey] = count
        localStorage.setItem(COUNT_CACHE_KEY, JSON.stringify(countCache.value))
      } catch (e) {
        console.warn('Could not get filtered total count', e)
      }
    }

    page.value = p
  } catch (error) {
    console.error('Failed to fetch accommodations page:', error)
  } finally {
    loading.value = false
  }
}

async function loadFilterOptions(api: 'et' | 'ea') {
  if (districtOptionsCache.value[api].length === 0) {
    try {
      const districts = await getUniqueDistricts(api)
      districtOptionsCache.value[api] = districts
      localStorage.setItem(`${DISTRICT_CACHE_KEY}_${api}`, JSON.stringify(districts))
    } catch (error) {
      console.error('Failed to fetch district options:', error)
    }
  }
  if (typeOptionsCache.value[api].length === 0) {
    try {
      const types = await getUniqueTypes(api)
      typeOptionsCache.value[api] = types
      localStorage.setItem(`${TYPE_CACHE_KEY}_${api}`, JSON.stringify(types))
    } catch (error) {
      console.error('Failed to fetch type options:', error)
    }
  }
}

onMounted(async () => {
  await loadFilterOptions(pageAccommodations.value)
  loadPage(1)
})

function onFilterChange() {
  page.value = 1 // Reset to first page
  loadPage(1)
}

function clearFilters() {
  selectedDistrict.value = ''
  selectedType.value = ''
  onFilterChange()
}

async function switchApi(x: 'et' | 'ea') {
  pageAccommodations.value = x;
  localStorage.setItem('selectedApi', x);
  await loadFilterOptions(x);
  clearFilters();
}

function onView(accom: Accom) {

  router.push({ name: 'AccommodationsDetails', params: { api: pageAccommodations.value, id: accom.id }})

}
</script>

<template>
  <section class="page">
    <header>
      <div class="pageLink"><router-link to="/">Inicio</router-link><p> /</p><h1>Acomodações</h1></div>
      <div class="option_bar">
        <div class="grid_options">
          <button @click="switchApi('et')" :class="{ active: pageAccommodations === 'et' }" :disabled="pageAccommodations === 'et'">Empreendimentos Turísticos</button>
          <button @click="switchApi('ea')" :class="{ active: pageAccommodations === 'ea' }" :disabled="pageAccommodations === 'ea'">Estabelecimentos de Alojamento Local</button>
        </div>
        <div class="filters">
          <label>
            Item por página:
            <select v-model="pageSize" @change="onFilterChange">
              <option value="28">Padrão</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>   
            </select>              
          </label>
          <label>
            Ordenar:
            <select v-model="selectedSort" @change="onFilterChange">
              <option value="">Padrão</option>
              <option value="Denominacao ASC">Nome (A-Z)</option>
              <option value="Denominacao DESC">Nome (Z-A)</option>
              <option :value="pageAccommodations === 'et' ? 'TipologiaET ASC' : 'Modalidade ASC'">Categoria (A-Z)</option>
              <option :value="pageAccommodations === 'et' ? 'TipologiaET DESC' : 'Modalidade DESC'">Categoria (Z-A)</option>
            </select>
          </label>
          <label id="label_district">
            Distrito:
            <select v-model="selectedDistrict" @change="onFilterChange">
              <option value="">Todos</option>
              <option v-for="district in districtOptions" :key="district" :value="district">{{ district }}</option>
            </select>
          </label>
          <label id="label_type">
            Categoria:
            <select v-model="selectedType" @change="onFilterChange">
              <option value="">Todos</option>
              <option v-for="type in typeOptions" :key="type" :value="type">{{ type.replace(/([A-Z])/g, ' $1').trim() }}</option>
            </select>
          </label>
          <label>
            <label id="label_clean">
              Limpar
            </label>
            <button class="clear-btn" @click="clearFilters">Limpar Filtros</button>
          </label>
        </div>
      </div>
    </header>

    <div v-if="loading" class="loading">
      <p>Loading accommodations...</p>
    </div>

    <div v-else-if="accommodations.length == 0" class="loading">
      <p>No items found</p>
    </div>

    <div v-else class="grid">
      <AccommodationCard
        v-for="item in accommodations"
        :key="item.id"
        :accommodation="item"
        @view="onView"
      />
    </div>

    <div class="pagination" v-if="totalPages">
      <button class="page-btn" @click="loadPage(1)" :disabled="page===1">«</button>
      <button class="page-btn" @click="loadPage(page-1)" :disabled="page===1">‹</button>

      <template v-for="(p, idx) in visiblePages" :key="idx">
        <button
          v-if="p !== '...'"
          class="page-num"
          @click="loadPage(p as number)"
          :class="{ active: p === page }"
        >{{ p }}</button>
        <span v-else class="ellipsis">…</span>
      </template>

      <button class="page-btn" @click="loadPage(page+1)" :disabled="totalPages ? page>=totalPages : false">›</button>
      <button class="page-btn" @click="loadPage(totalPages ?? page)" :disabled="totalPages ? page>=totalPages : false">»</button>
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
  margin: 0 auto 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.pageLink{
  width: 100%;
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
.option_bar{
  width: 100%;
  display: flex;
  align-items: end;
}
.grid_options{
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding-left: 0.2rem;
}
.grid_options button{
  width: 250px;
  padding: 0.5rem 1rem;
  background: #ffffff;
  color: rgb(0, 0, 0);
  border: 1px solid #cccccc;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.grid_options button.active{
  background: #16a3fc;
  color: white;
  border-color: #16a3fc;
}
.grid_options button:disabled{
  cursor: not-allowed;
}
.filters {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding-right: 0.2rem;
}
.filters label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: rgb(0, 0, 0);
  font-weight: bold;
}
.filters select {
  padding: 0.5rem;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background: white;
  font-size: 0.9rem;
}
#label_type select{ width: 241px; }
#label_district{ width: 142px; }
.clear-btn {
  padding: 0.5rem 1rem;
  background: #16a3fc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.clear-btn:hover {
  background: #1385d4;
}
#label_clean{
  visibility: hidden;
}
.grid {
  display: grid;
  width: 94%;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  justify-content: center;
  margin: 0 auto;
  padding-bottom: 2rem;
}

.grid > * {
  display: block;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
    width: 90%;
  }

  header {
    width: 90%;
    gap: 1rem;
  }

  .option_bar {
    flex-direction: column;
    align-items: stretch;
  }

  .grid_options {
    padding: 0;
  }

  .grid_options button {
    flex: 1;
  }

  .filters {
    justify-content: flex-start;
    flex-direction: column;
    gap: 1rem;
    padding: 0;
  }
}

.loading {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 2rem 0;
}

.pagination {
  display: flex;
  gap: .5rem;
  justify-content: center;
  align-items: center;
  margin: 1.25rem 0 3rem;
  flex-wrap: wrap;
}
.page-btn, .page-num {
  padding: .4rem .65rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}
.page-num.active {
  background: #16a3fc;
  color: #fff;
  border-color: transparent;
}
.page-btn:disabled, .page-num:disabled {
  opacity: .5;
  cursor: default;
}
.ellipsis { padding: 0 .5rem; color: #666 }
</style>
