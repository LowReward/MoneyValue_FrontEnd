<template>
    <div>
      <!-- Titre du convertisseur de devises -->
      <h2>Convertisseur de devises</h2>
  
      <!-- Sélecteur pour la devise de départ -->
      <div class="form-group">
        <label for="pairFrom">Devises de départ</label>
        <select id="pairFrom" class="form-control" v-model="selectedPairFrom" @change="filterPairs" required>
          <!-- Boucle sur les devises uniques disponibles -->
          <option v-for="currency in uniqueCurrenciesFrom" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
  
      <!-- Sélecteur pour la devise de retour -->
      <div class="form-group">
        <label for="pairTo">Devises de retour</label>
        <select id="pairTo" class="form-control" v-model="selectedPairTo" required>
          <!-- Boucle sur les devises filtrées disponibles -->
          <option v-for="currency in filteredCurrenciesTo" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
  
      <!-- Champ pour saisir le montant à convertir -->
      <div class="form-group">
        <label for="amount">Montant à convertir</label>
        <input id="amount" class="form-control" type="number" v-model="amount" min="0" max="999999" pattern="^[0-9]+(\.[0-9]{1,2})?$" step="0.01" required />
      </div>
  
      <!-- Bouton pour effectuer la conversion -->
      <button class="btn btn-primary" @click="convert">Convertir</button>
  
      <!-- Affichage du résultat de la conversion -->
      <div v-if="conversionResult" class="mt-4">
        Résultat de la conversion : {{ conversionResult }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        pairs: [], // Tableau pour stocker les paires de devises disponibles
        selectedPairFrom: '', // Devise de départ sélectionnée
        selectedPairTo: '', // Devise de retour sélectionnée
        amount: '', // Montant à convertir
        conversionResult: '', // Résultat de la conversion
      };
    },
    mounted() {
      this.fetchPairs(); // Appel de la méthode pour récupérer les paires de devises disponibles
    },
    computed: {
      uniqueCurrenciesFrom() {
        const currencies = new Set(); // Ensemble pour stocker les devises de départ uniques
        for (const pair of this.pairs) {
          currencies.add(pair.currency_from); // Ajout de chaque devise de départ dans l'ensemble
        }
        return Array.from(currencies); // Conversion de l'ensemble en tableau pour l'affichage dans le sélecteur
      },
      filteredCurrenciesTo() {
        const currencies = new Set(); // Ensemble pour stocker les devises de retour filtrées
        for (const pair of this.pairs) {
          if (pair.currency_from === this.selectedPairFrom) {
            currencies.add(pair.currency_to); // Ajout de chaque devise de retour compatible dans l'ensemble
          }
        }
        return Array.from(currencies); // Conversion de l'ensemble en tableau pour l'affichage dans le sélecteur
      },
    },
    methods: {
      fetchPairs() {
        axios
          .get('http://localhost:8000/api/pairs') // Appel à l'API pour récupérer les paires de devises
          .then(response => {
            this.pairs = response.data; // Stockage des paires de devises dans le tableau
          })
          .catch(error => {
            console.error(error);
          });
      },
      filterPairs() {
        this.selectedPairTo = ''; // Réinitialisation de la devise de retour sélectionnée lors du changement de la devise de départ
      },
      convert() {
        if (!this.selectedPairFrom || !this.selectedPairTo || !this.amount) {
          // Vérification si les champs sont vides
          alert('Veuillez sélectionner les devises et saisir un montant valide.');
          return;
        }
        const payload = {
          from_currency: this.selectedPairFrom, // Devise de départ sélectionnée
          to_currency: this.selectedPairTo, // Devise de retour sélectionnée
          amount: this.amount, // Montant à convertir
        };
        axios
          .post('http://localhost:8000/api/conversion', payload) // Appel à l'API pour effectuer la conversion
          .then(response => {
            this.conversionResult = response.data; // Stockage du résultat de la conversion
          })
          .catch(error => {
            console.error(error);
          });
      },
    },
  };
  </script>
  