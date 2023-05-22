<template>
    <div>
    <div class="d-flex justify-content-between align-items-center mt-5">
        <h2>Ajouter une paire:</h2>
      </div>
      <form @submit.prevent="createPair">
        <div class="form-group mt-4">
          <label for="currencyFrom">Devises (depuis):</label>
          <select class="form-control" id="currencyFrom"  v-model="newPair.currency_from" required>
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.name }} ({{ currency.code }})
            </option>
          </select>
        </div>
  
        <div class="form-group mt-4">
          <label for="currencyTo">Devises (vers):</label>
          <select class="form-control" id="currencyTo" v-model="newPair.currency_to" required>
            <option v-for="currency in fiteredCurrencies" :key="currency.code" :value="currency.code">
              {{ currency.name }} ({{ currency.code }})
            </option>
          </select>
        </div>
        <div class="form-group mt-4">
          <label for="conversion_rate">Taux de conversion:</label>
          <input type="number" class="form-control" id="conversion_rate" placeholder="0" min="0" max="999999" pattern="^[0-9]+(\.[0-9]{1,2})?$" step="0.01" v-model="newPair.conversion_rate" required>
        </div>
  
        <div class='mt-4 '>
        <button type="submit" class="btn btn-primary " >Créer la paire</button>
        <button type="button" class="btn btn-secondary mx-2" @click="cancelCreate">Annuler</button></div>
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
          conversion_rate: '',
        },
        currencies: []
      };
    },
    mounted() {
      this.fetchCurrencies();
    },
    computed:{
        fiteredCurrencies(){
            // Filtre dans notre tableau des devises fetched 
            // On vérifie si le code de la devise sélectionné est différent de la première partie du formulaire ( depuis => this.newPair.CURRENCY_FROM )
            // La nouvelle liste de devise filtrée est donc retournée sans celle selectionnée dans la première partie, on évite donc de pouvoir la sélectionnée dans les 2 en même temps
            return this.currencies.filter(currency=> currency.code !== this.newPair.currency_from)
        }
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
      },
      cancelCreate() {
      this.$emit('cancel');
    },
    }
  };
  </script>
  