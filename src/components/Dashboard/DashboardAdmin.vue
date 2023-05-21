<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand " href="#">Dashboard MoneyValue</a>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <!-- Lien pour accéder à la vue des Pairs -->
              <router-link class="nav-link" to="/admin/dashboard/pairs">Pairs</router-link>
            </li>
            <li class="nav-item">
              <!-- Lien pour accéder à la vue des Currencies -->
              <router-link class="nav-link" to="/admin/dashboard/currencies">Currencies</router-link>
            </li>
          </ul>
        </div>
      </nav>
      <!-- Le contenu correspondant à l'URL de nav sera affiché à cette emplacement
          donc quand un clique est produit sur la vue correspondante, un rendue sera produit
          dans notre balise router-view -->
      <router-view></router-view>
    </div>
  </template>
  
  
  
  <script>
  export default {
    name: 'DashboardAdmin',
  }
  </script>
  