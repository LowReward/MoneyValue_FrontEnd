<template>
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li>
            <!-- Lien pour accéder à la vue des Pairs -->
            <router-link to="/admin/dashboard/pairs">Pairs</router-link>
          </li>
          <li>
            <!-- Lien pour accéder à la vue des Currencies -->
            <router-link to="/admin/dashboard/currencies">Currencies</router-link>
          </li>
        </ul>
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
  