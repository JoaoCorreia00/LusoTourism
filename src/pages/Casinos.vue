<script setup>
import { ref } from 'vue'

const casinos = ref([
  {
    denominacao: 'Casino Example 1',
    lotacao: 500,
    maquinas: 200,
    jogosBancados: true,
    salaEspetaculos: true,
    salaReunioesCongressos: true,
    restaurantes: 2,
    bares: 1,
    website: 'https://example1.com',
    endereco: 'Rua 1, 1000',
    localidadeCP: 'Lisboa, 1000-001',
    freguesia: 'Belém',
    concelho: 'Lisboa',
    distrito: 'Lisboa'
  },
])

const bingos = ref([
  {
    denominacao: 'Bingo Example 1',
    lotacao: 200,
    salaEspetaculos: true,
    restaurantes: 1,
    bares: 0,
    website: 'https://bingo1.com',
    endereco: 'Rua 4, 4000',
    localidadeCP: 'Lisboa, 4000-004',
    freguesia: 'Misericórdia',
    concelho: 'Lisboa',
    distrito: 'Lisboa'
  },
])
</script>

<template>
  <section class="page">
    <header>
      <div class="pageLink">
        <router-link to="/">Inicio</router-link>
        <p> /</p>
        <h1>Casinos & Bingos</h1>
      </div>
    </header>

    <div class="content">
      <div class="intro">
        <h2>Discover the Thrill of Casinos and Bingos in Portugal</h2>
        <p>Explore a selection of premier gaming establishments across the country, offering entertainment, dining, and more.</p>
      </div>

      <section class="section casinos-section">
        <h3>Casinos</h3>
        <div class="items-grid">
          <article v-for="casino in casinos" :key="casino.denominacao" class="item-card">
            <img :src="'/src/assets/Img_slider_1.jpg'" alt="Casino Image" class="item-image">
            <div class="item-content">
              <h4>{{ casino.denominacao }}</h4>
              <p class="location"><strong>Location:</strong> {{ casino.endereco }}, {{ casino.localidadeCP }}, {{ casino.freguesia }}, {{ casino.concelho }}, {{ casino.distrito }}</p>
              <p class="capacity"><strong>Capacity:</strong> {{ casino.lotacao }}</p>
              <p class="features">
                <strong>Features:</strong><br>
                Machines: {{ casino.maquinas }} | Jogos Bancados: {{ casino.jogosBancados ? 'Yes' : 'No' }}<br>
                Sala Espetáculos: {{ casino.salaEspetaculos ? 'Yes' : 'No' }} | Sala Reuniões: {{ casino.salaReunioesCongressos ? 'Yes' : 'No' }}<br>
                Restaurantes: {{ casino.restaurantes }} | Bares: {{ casino.bares }}
              </p>
              <a :href="casino.website" target="_blank" class="website-link">Visit Website</a>
            </div>
          </article>
        </div>
      </section>

      <section class="section bingos-section">
        <h3>Bingos</h3>
        <div class="items-grid">
          <article v-for="bingo in bingos" :key="bingo.denominacao || bingo.nominacao" class="item-card">
            <img :src="'/src/assets/Img_slider_1.jpg'" alt="Bingo Image" class="item-image">
            <div class="item-content">
              <h4>{{ bingo.denominacao || bingo.nominacao }}</h4>
              <p class="location"><strong>Location:</strong> {{ bingo.endereco }}, {{ bingo.localidadeCP }}, {{ bingo.freguesia }}, {{ bingo.concelho }}, {{ bingo.distrito }}</p>
              <p class="capacity"><strong>Capacity:</strong> {{ bingo.lotacao }}</p>
              <p class="features">
                <strong>Features:</strong><br>
                Sala Espetáculos: {{ bingo.salaEspetaculos ? 'Yes' : 'No' }} | Restaurantes: {{ bingo.restaurantes }} | Bares: {{ bingo.bares }}
              </p>
              <a :href="bingo.website" target="_blank" class="website-link">Visit Website</a>
            </div>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.page {
  width: 100%;
  min-height: 100vh;
  padding: 0;
}

header {
  width: 94%;
  padding: 1rem;
  margin: 0 auto 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pageLink {
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

.content {
  width: 94%;
  margin: 0 auto;
  padding-bottom: 2rem;
}

.intro {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.intro h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0 0 1rem 0;
}

.intro p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.section {
  margin-bottom: 3rem;
}

.section h3 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-left: 4px solid #16a3fc;
  padding-left: 1rem;
}

.items-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.item-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform .2s ease, box-shadow .2s ease;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #16a3fc;
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.item-content {
  padding: 1.5rem;
}

.item-content h4 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
}

.location, .capacity, .features {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

.features {
  margin: 0 0 1rem 0;
}

.website-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #16a3fc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background 0.3s ease;
}

.website-link:hover {
  background: #1385d4;
}

@media (max-width: 768px) {
  .content, header {
    width: 90%;
  }

  .items-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .intro {
    padding: 1.5rem;
  }

  .intro h2 {
    font-size: 1.5rem;
  }

  .section h3 {
    font-size: 1.5rem;
  }

  .item-content {
    padding: 1rem;
  }
}
</style>
