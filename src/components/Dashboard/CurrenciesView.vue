<template>
    <div>
      <h2>Currencies</h2>
      <ul>
        <!-- Boucle d'affichage pour toutes les devises contenues dans notre réponse -->
        <li v-for="currency in currencies" :key="currency.id">
          {{ currency.name }} - {{ currency.code }}
        </li>
      </ul>
    </div>
</template>
  
<script>
    // Import de notre instance axios créer et comportant l'envoie authorization bearer
   import axiosClient from '../../plugins/axios.js';
  export default {
    name: 'CurrenciesView',
    data() {
      return {
        // Retourne un tableau contenant toutes nos devises
        currencies: []
      };
    },
    mounted() {
      // Appel à l'API pour récupérer les devises depuis le backend
      this.fetchCurrencies();
    },
    methods: {
      fetchCurrencies() {
        // Effectuer une requête HTTP pour récupérer les devises depuis le backend
        axiosClient.get('http://localhost:8000/api/currencies')
          .then(response => {
            this.currencies = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };
  </script>
  