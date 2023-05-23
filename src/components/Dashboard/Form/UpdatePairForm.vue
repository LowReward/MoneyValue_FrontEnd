<template>
    <div>
      <h3>Modifier une paire</h3>
      <form @submit.prevent="updatePair">
        <div class="form-group mt-4">
          <label for="currencyFrom">Devises (depuis)</label>
          <select v-model="updatedPair.currency_from" placeholder="Selectionnez une devise (depuis)" class="form-control" required>
            <option v-for="currency in currencies" :value="currency.code" :key="currency.code">
              {{ currency.code }}
            </option>
          </select>
        </div>
        <div class="form-group mt-4">
          <label for="currencyTo">Devises (vers)</label>
          <select v-model="updatedPair.currency_to" placeholder="Selectionnez une devise (vers)" class="form-control" required>
            <option v-for="currency in fiteredCurrencies" :value="currency.code" :key="currency.code">
              {{ currency.code }}
            </option>
          </select>
        </div>
        <div class="form-group mt-4">
          <label for="conversionRate">Taux de conversion</label>
          <input v-model="updatedPair.conversion_rate" type="number" class="form-control" id="conversionRate"  min="0" max="999999" pattern="^[0-9]+(\.[0-9]{1,2})?$" step="0.01" required>
        </div>
        <div class='mt-4 '>
        <button type="submit" class="btn btn-primary ">Mettre à jour</button>
        <button type="button" class="btn btn-secondary mx-2" @click="cancelUpdate">Annuler</button></div>
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
