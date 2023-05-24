<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        
        <div class="container">
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

    <footer class="footer mt-5" style="background-color: #f8f9fa; padding: 20px 0; bottom: 0; position: fixed; width: 100%;">
      <div class="container text-center">
        <p>Le dashboard n'est accessible que pour l'adminstrateur, veuillez gardez vos informations de manière confidentielle.</p>
      </div>
    </footer>
  </template>
  
  
  
  
  
  
  
  <script>
  export default {
    name: 'DashboardAdmin',
  }
  </script>




  