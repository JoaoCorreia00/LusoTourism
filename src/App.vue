<script lang="ts" setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header>
    <nav>
      <div id="Homediv">
        <router-link to="/"><img src="/Luso2.png" alt="LusoTourism Logo" /></router-link>
      </div>
      <div id="Navbardiv">
        <router-link to="/">Inicio</router-link>
        <router-link to="/accommodations">Alojamentos</router-link>
        <router-link to="/casinos">Casinos</router-link>
        <!-- <router-link to="/">Surf Spots</router-link> -->
        <!-- <router-link to="/">English</router-link> -->
      </div>
      <button @click="toggleMenu" class="hamburger" id="hamburger-btn">☰</button>
    </nav>
    <div v-show="isMenuOpen" class="overlay" @click="toggleMenu"></div>
    <div id="mobile-menu" v-show="isMenuOpen" @click.stop>
      <button @click="toggleMenu" class="close-btn">×</button>
      <router-link to="/" @click="toggleMenu">Inicio</router-link>
      <router-link to="/accommodations" @click="toggleMenu">Alojamentos</router-link>
      <router-link to="/casinos" @click="toggleMenu">Casinos</router-link>
      <!-- <router-link to="/" @click="toggleMenu">Surf Spots</router-link> -->
      <!-- <router-link to="/" @click="toggleMenu">English</router-link> -->
    </div>
  </header>

  <router-view />
</template>

<style scoped>
  header {
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    width: 100vw;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid #e0e0e0;
  }

  nav {
    width: 94%;
    margin: 0 auto;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  nav a {
    color: #333;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    position: relative;
  }

  nav a:hover {
    background: rgba(22, 163, 252, 0.1);
    color: #16a3fc;
  }

  .router-link-active {
    background: #16a3fc;
    color: white;
    box-shadow: 0 2px 4px rgba(22, 163, 252, 0.2);
  }

  .router-link-active:hover {
    background: #1382c7;
  }

  /* Prevent logo from showing active state */
  #Homediv .router-link-active {
    background: transparent;
    color: inherit;
    box-shadow: none;
  }

  #Homediv .router-link-active:hover {
    background: transparent;
  }

  #Homediv {
    flex: 0 0 250px;
    display: flex;
    align-items: center;
    padding-left: 1rem;
  }

  #Homediv img {
    width: 100%;
    max-width: 180px;
    height: auto;
    transition: opacity 0.3s ease;
  }

  #Homediv img:hover {
    opacity: 0.8;
  }

  #Navbardiv {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #333;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background 0.3s ease;
  }

  .hamburger:hover {
    background: rgba(22, 163, 252, 0.1);
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .close-btn {
    align-self: flex-end;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #333;
    padding: 0.5rem;
    margin-bottom: 2rem;
    transition: color 0.3s ease;
  }

  .close-btn:hover {
    color: #16a3fc;
  }

  #mobile-menu {
    display: none;
  }

  #mobile-menu a {
    display: block;
    color: #333;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.2rem;
    padding: 1rem 2rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    text-align: left;
    margin-bottom: 0.5rem;
  }

  #mobile-menu a:hover {
    background: rgba(22, 163, 252, 0.1);
    color: #16a3fc;
  }

  @media (max-width: 768px) {
    nav {
      width: 90%;
      height: 60px;
      justify-content: space-between;
    }

    .router-link-active {
      background: #16a3fc;
      color: white;
    }

    #Homediv {
      flex: none;
      padding-left: 0;
      margin-left: -1.2rem;
    }

    #Homediv img {
      max-width: 130px;
    }

    #Navbardiv {
      display: none;
    }

    .hamburger {
      display: block;
    }

    #mobile-menu {
      position: fixed;
      top: -20px;
      right: 0;
      width: 55vw;
      height: 100vh;
      background: white;
      backdrop-filter: blur(10px);
      z-index: 1001;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 2rem;
      box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
    }

    #mobile-menu a {
      font-size: 1.2rem;
      padding: 1rem 2rem;
      margin-bottom: 0.5rem;
    }
  }

</style>
