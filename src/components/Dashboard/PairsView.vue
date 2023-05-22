<template>
    <div>
      <!-- Afficher la liste des paires si showCreateForm est false -->
      <template v-if="!showCreateForm && !showUpdateForm">
        <div v-if="showConfirmation" class="alert alert-danger mt-4">Paire supprimée avec succès.</div>
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
                <!-- Appel de la fonction deletePair avec la clé de l'élément en question -->
                <button class="btn btn-sm btn-danger" @click="deletePair(pair)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <!-- Afficher le formulaire de création de paire -->
      <template v-if="showCreateForm">
        <!-- Si showCreateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-created
          reçu de notre CreatePairForm.vue, alors showCreateForm passe à false via la fonction onPairCreated-->
        <create-pair-form @pair-created="onPairCreated" />
      </template>
      <!-- Afficher le formulaire de mise à jour de paire -->
      <template v-if="showUpdateForm">
        <!-- Si showUpdateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-updated
          reçu de notre UpdatePairForm.vue, alors showUpdateForm passe à false via la fonction onPairUpdated-->
        <update-pair-form :pair="selectedPair" @pair-updated="onPairUpdated" />
      </template>
    </div>
  </template>
  
  <script>
  import axiosClient from '../../plugins/axios.js';
  import CreatePairForm from './Form/CreatePairForm.vue';
  import UpdatePairForm from './Form/UpdatePairForm.vue';
  
  export default {
    name: 'PairsView',
    data() {
      return {
        pairs: [],
        showCreateForm: false,
        showUpdateForm: false,
        selectedPair: null,
        showConfirmation: false,
      };
    },
  
    mounted() {
      this.fetchPairs();
    },
  
    components: {
      CreatePairForm,
      UpdatePairForm,
    },
  
    methods: {
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
        this.showCreateForm = false;
        this.fetchPairs();
      },
  
      editPair(pair) {
        this.selectedPair = pair;
        this.showUpdateForm = true;
      },
  
      onPairUpdated() {
        this.showUpdateForm = false;
        this.fetchPairs();
      },
  
      deletePair(pair) {
        axiosClient
          .delete(`http://localhost:8000/api/pairs/${pair.id}`)
          .then(response => {
            console.log(response);
            this.fetchPairs();
            this.showConfirmation = true;
            setTimeout(() => {
              this.showConfirmation = false;
            }, 3000);
          })
          .catch(error => {
            console.error(error);
          });
      },
    },
  };
  </script>
  