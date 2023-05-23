<template>
    <div>
      
    <div v-if="showError422" class="alert alert-danger mt-4">Le code pour cette devise existe déjà.</div>
    <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>
    <div class="d-flex justify-content-between align-items-center mt-5">
        <h2>Ajouter une devise:</h2>
      </div>
      <form @submit.prevent="createCurrency">
        <div class="form-group mt-4">
          <label for="currency_code">Code de la Devise:</label>
          <input class="form-control" id="currency_code" v-model="newCurrency.code" required>
        </div>
  
        <div class="form-group mt-4">
          <label for="currency_name">Nom de la Devise:</label>
          <input class="form-control" id="currency_name" v-model="newCurrency.name" required>
        </div>
        <div class='mt-4 '>
        <button type="submit" class="btn btn-primary " >Créer la devise</button>
        <button type="button" class="btn btn-secondary mx-2" @click="cancelCreate">Annuler</button></div>
      </form>
    </div>
  </template>
  
  <script>
  import axiosClient from '../../../plugins/axios.js';
  
  export default {
    name: 'CreateCurrencyForm',
    data() {
      return {
        newCurrency: {
          code: '',
          name: '',
        },
        showError422: false,
        showErrorRandom: false,
      };
    },
    methods: {
      createCurrency() {
        // Effectuer la requête HTTP pour créer la paire dans le backend
        axiosClient.post('http://localhost:8000/api/currencies', this.newCurrency)
          .then(response => {
            console.log(response),
            this.$emit('currency-created');
            console.log('Devise créée avec succès');
          })
          .catch(error => {
            // Gére l'erreur s'il y en a une
            if (error.response && error.response.status === 422) {
              // Gére l'erreur de validation avec le code 422
              this.showError422 = true,
                setTimeout(() => {
                  this.showError422 = false;
                }, 5000);
              console.error('Erreur de validation :', error.response.data.errors);
            } else {
              // Gére toutes les autres erreurs
              this.showErrorRandom = true,
                setTimeout(() => {
                  this.showErrorRandom = false;
                }, 5000);
              console.error('Une erreur s\'est produite :', error);
            }
          });
      },
      cancelCreate() {
      this.$emit('cancel');
    },
    }
  };
  </script>
  