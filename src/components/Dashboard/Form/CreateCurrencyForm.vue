<template>
    <div>
    <div class="d-flex justify-content-between align-items-center mt-5">
        <h2>Ajouter une devise:</h2>
      </div>
      <form @submit.prevent="createCurrency">
        <div class="form-group">
          <label for="currency_code">Code de la Devise:</label>
          <input class="form-control" id="currency_code" v-model="newCurrency.code">
        </div>
  
        <div class="form-group">
          <label for="currency_name">Nom de la Devise:</label>
          <input class="form-control" id="currency_name" v-model="newCurrency.name">
        </div>
        <button type="submit" class="btn btn-primary" @click="createPair" >Créer la devise</button>
        <button type="button" class="btn btn-secondary" @click="cancelCreate">Annuler</button>
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
      };
    },
    methods: {
      createPair() {
        // Effectuer la requête HTTP pour créer la paire dans le backend
        axiosClient.post('http://localhost:8000/api/currencies', this.newCurrency)
          .then(response => {
            console.log(response),
            this.$emit('currency-created');
            console.log('Devise créée avec succès');
          })
          .catch(error => {
            // Gérer l'erreur s'il y en a une
            console.error(error);
          });
      },
      cancelCreate() {
      this.$emit('cancel');
    },
    }
  };
  </script>
  