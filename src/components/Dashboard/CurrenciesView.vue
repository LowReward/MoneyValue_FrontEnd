<template>
    <div>
      <!-- Afficher la liste des paires si showCreateForm et showUpdateForm sont sur false -->
      <template v-if="!showCreateForm && !showUpdateForm">
        <div v-if="showConfirmationCreated" class="alert alert-success mt-4">Devise créee avec succès.</div>
        <div v-if="showConfirmationUpdated" class="alert alert-success mt-4">Devise modifiée avec succès.</div>
        <div v-if="showConfirmationDeleted" class="alert alert-danger mt-4">Devise supprimée avec succès.</div>
        <div class="d-flex justify-content-between align-items-center mt-5">
          <h2>Liste des devises:</h2>
          <!-- Appel de la méthode toggleCreateForm pour afficher le form de création de paire -->
          <button class="btn btn-primary " @click="toggleCreateForm">Ajouter une devise</button>
        </div>
        <table class="table  mt-5">
          <!-- Contenu du tableau -->
          <thead>
            <tr>
              <th scope="col">Devises</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- itération sur le tableau pairs avec une clé (:key) pour chaque élément de la boucle -->
            <tr v-for="currency in currencies" :key="currency.id">
              <!-- Affiche les devises contenues dans chaque élément -->
              <td>{{ currency.name }} - {{ currency.code }}</td>
              <td>
                <!-- À venir -->
                <button class="btn btn-sm btn-primary " @click="editCurrency(currency)">Modifier</button>
                <!-- Appel de la fonction deletePair avec la clé de l'élément en question -->
                <button class="btn btn-sm btn-danger" @click="deleteCurrency(currency)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <!-- Afficher le formulaire de création de paire -->
      <template v-if="showCreateForm">
        <!-- Si showCreateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-created
          reçu de notre CreatePairForm.vue, alors showCreateForm passe à false via la fonction onPairCreated-->
        <create-currency-form @currency-created="onCurrencyCreated" @cancel="toggleCreateForm"/>
      </template>
      <!-- Afficher le formulaire de mise à jour de paire -->
      <template v-if="showUpdateForm">
        <!-- Si showUpdateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-updated
          reçu de notre UpdatePairForm.vue, alors showUpdateForm passe à false via la fonction onPairUpdated-->
        <update-currency-form :currency="selectedCurrency" @currency-updated="onCurrencyUpdated" @cancel="cancelUpdate"/>
      </template>
    </div>
  </template>
  
  <script>
  import axiosClient from '../../plugins/axios.js';
  import CreateCurrencyForm from './Form/CreateCurrencyForm.vue';
  import UpdateCurrencyForm from './Form/UpdateCurrencyForm.vue';
  
  export default {
    name: 'CurrenciesView',
    data() {
      return {
        currencies: [],
        showCreateForm: false,
        showUpdateForm: false,
        selectedCurrency: null,
        showConfirmationCreated: false,
        showConfirmationUpdated: false,
        showConfirmationDeleted: false,
      };
    },
  
    mounted() {
      this.fetchCurrencies();
    },
  
    components: {
      CreateCurrencyForm,
      UpdateCurrencyForm,
    },
  
    methods: {
      fetchCurrencies() {
        axiosClient
          .get('http://localhost:8000/api/admin/currencies')
          .then(response => {
            this.currencies = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
  
      toggleCreateForm() {
        this.showCreateForm = !this.showCreateForm;
      },
  
      onCurrencyCreated() {
        this.showCreateForm = false;
        this.fetchCurrencies();
        this.showConfirmationCreated = true;
            setTimeout(() => {
              this.showConfirmationCreated = false;
            }, 3000);
      },
  
      editCurrency(currency) {
        this.selectedCurrency = currency;
        this.showUpdateForm = true;
      },
  
      onPairUpdated() {
        this.showUpdateForm = false;
        this.fetchCurrencies();
        this.showConfirmationUpdated = true;
            setTimeout(() => {
              this.showConfirmationUpdated = false;
            }, 3000);
      },
      

      cancelUpdate() {
      this.showUpdateForm = false;
      },
      
  
      deleteCurrency(currency) {
        axiosClient
          .delete(`http://localhost:8000/api/admin/currencies/${currency.id}`)
          .then(response => {
            console.log(response);
            this.fetchCurrencies();
            this.showConfirmationDeleted = true;
            setTimeout(() => {
              this.showConfirmationDeleted = false;
            }, 3000);
          })
          .catch(error => {
            console.error(error);
          });
      },
    },
  };
  </script>
  