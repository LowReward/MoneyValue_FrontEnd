<template>
    <div>
      <!-- Afficher la liste des paires si showCreateForm est false -->
      <template v-if="!showCreateForm">
        <div class="d-flex justify-content-between align-items-center mt-5">
          <h2>Liste des paires:</h2>
          <!-- Appel de la méthode toggleCreateForm pour afficher le form de création de paire -->
          <button class="btn btn-primary" @click="toggleCreateForm">Ajouter une paire</button>
        </div>
        <table class="table mt-4">
          <!-- Contenu du tableau -->
          <thead>
            <tr>
              <th scope="col">Paires</th>
              <th scope="col">Nombre de requêtes</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- itération sur le tableau pairs avec une clé (:key) pour chaque élément de la boucle -->
            <tr v-for="pair in pairs" :key="pair.id">
              <!-- Affiche les devises contenues dans chaque élément -->
              <td>{{ pair.currency_from }} - {{ pair.currency_to }}</td>
              <!-- Affiche le nombre de requêtes aux pairs dans chaque élément -->
              <td>{{ pair.request_count }}</td>
              <td>
                <!-- À venir -->
                <button class="btn btn-sm btn-primary " @click="editPair(pair)">Modifier</button>
                <!-- Appel de la fonction deletePair avec la clé de l'élèment en question -->
                <button class="btn btn-sm btn-danger" @click="deletePair(pair)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <!-- Afficher le formulaire de création de paire -->
      <template v-else>
        <!-- Si showCreateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-created
        reçu de notre CreatePairForm.vue, alors showCreateForm passe à false via la fonction onPaireCreated-->
        <create-pair-form v-if="showCreateForm" @pair-created="onPairCreated" />
      </template>
    </div>
  </template>
  
  <script>
  import axiosClient from '../../plugins/axios.js';
  import CreatePairForm from './Form/CreatePairForm.vue';
  
  export default {
    name: 'PairsView',
    data() {
      return {
        pairs: [],
        showCreateForm: false,
      };
    },
    mounted() {
      this.fetchPairs();
    },
    components: {
      CreatePairForm,
    },
    methods: {
       // Récupération de la liste des paires 
      fetchPairs() {
        axiosClient
          .get('http://localhost:8000/api/pairs')
          .then(response => {
            this.pairs = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      toggleCreateForm() {
        this.showCreateForm = !this.showCreateForm;
      },
      onPairCreated() {
        // La paire a été créée avec succès, masquer le formulaire et afficher le tableau
        this.showCreateForm = false;
      },
      editPair(pair) {
        // Logique pour éditer la paire
        console.log('Édition de la paire:', pair);
      },
      deletePair(pair) {
        // Logique pour supprimer la paire
        console.log('Suppression de la paire:', pair);
      },
    },
  };
  </script>
  