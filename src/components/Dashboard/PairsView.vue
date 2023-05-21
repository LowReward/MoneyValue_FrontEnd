<template>
    <div>
      <div class="d-flex justify-content-between align-items-center mt-5">
        <h2>Liste des paires:</h2>
        <button class="btn btn-primary" @click="addPair">Ajouter une paire</button>
      </div>
      <table class="table mt-4">
        <thead>
          <tr>
            <th scope="col">Paires</th>
            <th scope="col">Nombre de requêtes</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pair in pairs" :key="pair.id">
            <td>{{ pair.currency_from }} - {{ pair.currency_to }}</td>
            <td>{{ pair.request_count }}</td>
            <td>
              <button class="btn btn-sm btn-primary " @click="editPair(pair)">Modifier</button>
              <button class="btn btn-sm btn-danger" @click="deletePair(pair)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
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
  