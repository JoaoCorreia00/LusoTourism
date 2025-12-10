<script lang="ts" setup>

</script>

<template>
  <header>
    <nav>
      <div id="Homediv">
        <router-link to="/"><img src="/src/assets/Luso2.png" alt="LusoTourism Logo" /></router-link>
      </div>
      <div id="Navbardiv">
        <router-link to="/accommodations">Acomodações</router-link>
        <router-link to="/casinos">Casinos</router-link>
        <router-link to="/">Surf Spots</router-link>
        <router-link to="/">English</router-link>
      </div>
    </nav>
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

  @media (max-width: 768px) {
    nav {
      width: 90%;
      height: 70px;
      flex-direction: column;
      justify-content: center;
      gap: 0.5rem;
    }

    .router-link-active {
      background: #16a3fc;
      color: white;
    }

    #Homediv {
      flex: none;
      padding-left: 0;
    }

    #Homediv img {
      max-width: 140px;
    }

    #Navbardiv {
      width: 100%;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    nav a {
      font-size: 0.9rem;
      padding: 0.4rem 0.8rem;
    }
  }

</style>
