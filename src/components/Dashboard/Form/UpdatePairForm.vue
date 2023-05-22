<template>
    <div>
      <h3>Modifier une paire</h3>
      <form @submit.prevent="updatePair">
        <div class="form-group">
          <label for="currencyFrom">Devises (depuis)</label>
          <select v-model="updatedPair.currency_from" class="form-control" required>
            <option v-for="currency in currencies" :value="currency.code" :key="currency.code">
              {{ currency.code }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="currencyTo">Devises (vers)</label>
          <select v-model="updatedPair.currency_to" class="form-control" required>
            <option v-for="currency in currencies" :value="currency.code" :key="currency.code">
              {{ currency.code }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="conversionRate">Taux de conversion</label>
          <input v-model="updatedPair.conversion_rate" type="text" class="form-control" id="conversionRate" required>
        </div>
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
        <button type="button" class="btn btn-secondary" @click="cancelUpdate">Annuler</button>
      </form>
    </div>
  </template>
  

<script>
import axiosClient from '../../../plugins/axios.js';

export default {
  name: 'UpdatePairForm',
  props: {
    pair: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      updatedPair: null,
      currencies: [], // Liste des devises existantes
      selectedCurrency: null, // Devise sélectionnée
    };
  },
  created() {
    this.updatedPair = { ...this.pair }; // Effectue une copie de la paire pour éviter de modifier la prop directement
    this.fetchCurrencies(); // Appel de la méthode pour récupérer la liste des devises
  },
  methods: {
    fetchCurrencies() {
      axiosClient.get('http://localhost:8000/api/currencies')
        .then(response => {
          this.currencies = response.data;
          this.selectedCurrency = this.pair.currency_from; // Sélectionne la devise de la paire à éditer
        })
        .catch(error => {
          console.error(error);
        });
    },
    updatePair() {
      axiosClient
        .put(`http://localhost:8000/api/pairs/${this.pair.id}`, {
          currency_from: this.updatedPair.currency_from,
          currency_to: this.updatedPair.currency_to,
          conversion_rate: this.updatedPair.conversion_rate,
        })
        .then(response => {
          console.log(response);
          this.$emit('pair-updated');
        })
        .catch(error => {
          console.error(error);
        });
    },
    cancelUpdate() {
      this.$emit('cancel');
    },
  },
};
</script>
