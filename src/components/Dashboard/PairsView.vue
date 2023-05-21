<template>
    <div>
      <h2>Pairs</h2>
      <ul>
        <li v-for="pair in pairs" :key="pair.id">
          {{ pair.currency_from }} - {{ pair.currency_to }} - {{ pair.request_count }}
          <button @click="editPair(pair)">Modifier</button>
          <button @click="deletePair(pair)">Supprimer</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axiosClient from '../../plugins/axios.js';
  
  export default {
    name: 'PairsView',
    data() {
      return {
        pairs: []
      };
    },
    mounted() {
      this.fetchPairs();
    },
    methods: {
      fetchPairs() {
        axiosClient.get('http://localhost:8000/api/pairs')
          .then(response => {
            this.pairs = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      editPair(pair) {
        // Logique pour éditer la paire
        console.log('Édition de la paire :', pair);
      },
      deletePair(pair) {
        // Logique pour supprimer la paire
        console.log('Suppression de la paire :', pair);
      }
    }
  };
  </script>
  