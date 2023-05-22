<template>
    <div>
    <div class="d-flex justify-content-between align-items-center mt-5">
        <h2>Ajouter une paire:</h2>
      </div>
      <form @submit.prevent="createPair">
        <div class="form-group">
          <label for="currencyFrom">Devise de départ:</label>
          <select class="form-control" id="currencyFrom" v-model="newPair.currency_from">
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.name }} ({{ currency.code }})
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="currencyTo">Devise d'arrivée:</label>
          <select class="form-control" id="currencyTo" v-model="newPair.currency_to">
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.name }} ({{ currency.code }})
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="conversion_rate">Taux de conversion:</label>
          <input class="form-control" id="conversion_rate" v-model="newPair.conversion_rate">
        </div>
  
  
        <button type="submit" class="btn btn-primary" @click="createPair" >Créer la paire</button>
      </form>
    </div>
  </template>
  
  <script>
  import axiosClient from '../../../plugins/axios.js';
  
  export default {
    name: 'CreatePairForm',
    data() {
      return {
        newPair: {
          currency_from: '',
          currency_to: '',
          conversion_rate: 0,
        },
        currencies: []
      };
    },
    mounted() {
      this.fetchCurrencies();
    },
    methods: {
      fetchCurrencies() {
        axiosClient.get('http://localhost:8000/api/currencies')
          .then(response => {
            this.currencies = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      createPair() {
        // Effectuer la requête HTTP pour créer la paire dans le backend
        axiosClient.post('http://localhost:8000/api/pairs', this.newPair)
          .then(response => {
            console.log(response),
            this.$emit('pair-created');
            console.log('Paire créée avec succès');
          })
          .catch(error => {
            // Gérer l'erreur s'il y en a une
            console.error(error);
          });
      }
    }
  };
  </script>
  