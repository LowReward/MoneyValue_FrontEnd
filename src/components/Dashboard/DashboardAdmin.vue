<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        
        <div class="collapse navbar-collapse text-center" id="navbarNav">
            <a class="navbar-brand mx-auto" href="#">Dashboard MoneyValue</a>
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <!-- Lien pour accéder à la vue des Pairs -->
              <router-link class="nav-link" to="/admin/dashboard/pairs">Paires</router-link>
            </li>
            <li class="nav-item">
              <!-- Lien pour accéder à la vue des Currencies -->
              <router-link class="nav-link" to="/admin/dashboard/currencies">Devises</router-link>
            </li>
          </ul>
        </div>
      </nav>
      <!-- Le contenu correspondant à l'URL de nav sera affiché à cet emplacement
          donc quand un clic est produit sur la vue correspondante, un rendu sera produit
          dans notre balise router-view -->
      <div class="container d-flex justify-content-center mt-5">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  
  
  
  
  
  <script>
  export default {
    name: 'DashboardAdmin',
  }
  </script>



  