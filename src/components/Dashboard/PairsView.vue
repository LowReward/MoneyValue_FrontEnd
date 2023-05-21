<template>
    <div>
      <h2>Pairs</h2>
      <ul>
        <!-- Boucle d'affichage pour toutes les pairs contenues dans notre réponse -->
        <li v-for="pair in pairs" :key="pair.id">
          {{ pair.currency_from }} - {{ pair.currency_to }} - {{ pair.request_count }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  // Import de notre instance axios créer et comportant l'envoie authorization bearer
  import axiosClient from '../../plugins/axios.js';
  
  export default {
    name: 'PairsView',
    data() {
      return {
        // Retourne un tableau contenant toutes nos pairs
        pairs: []
      };
    },
    mounted() {
      // Appel à l'API pour récupérer les pairs depuis le backend
      this.fetchPairs();
    },
    methods: {
      fetchPairs() {
        // Effectuer une requête HTTP pour récupérer les pairs depuis le backend
        axiosClient.get('http://localhost:8000/api/pairs')
          .then(response => {
            this.pairs = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };
  </script>
  