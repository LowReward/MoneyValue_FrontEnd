<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand mx-auto" href="#">MoneyValue</a>
            </div>
        </nav>

        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <h2 class="text-center">Currency converter</h2>

                    <div class="d-flex justify-content-between mt-5">
                        <div class="form-group">
                            <label for="pairFrom">Currency From :</label>
                            <select id="pairFrom" class="form-control" v-model="selectedPairFrom" @change="filterPairs"
                                required>
                                <option v-for="currency in uniqueCurrenciesFrom" :key="currency" :value="currency">{{
                                    currency }}</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="pairTo">Currency To :</label>
                            <select id="pairTo" class="form-control" v-model="selectedPairTo" required>
                                <option v-for="currency in filteredCurrenciesTo" :key="currency" :value="currency">{{
                                    currency }}</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="amount">Amount to convert :</label>
                            <input id="amount" class="form-control" type="number" v-model="amount" min="0" max="999999"
                                pattern="^[0-9]+(\.[0-9]{1,2})?$" step="0.01" required />
                        </div>

                        <button class="btn btn-primary" @click="convert">Convert</button>
                    </div>

                    <div v-if="conversionResult" class="text-center mt-4">
                        Conversion result : {{ conversionResult.toFixed(3) }}
                    </div>
                </div>
            </div>
        </div>

        <footer class="footer mt-5"
            style="background-color: #f8f9fa; padding: 20px 0; bottom: 0; position: fixed; width: 100%;">
            <div class="container text-center">
                <p>Welcome to MoneyValue, the currency conversion platform designed specifically for
                    developers. Access our free and powerful REST API to perform currency conversions
                    with ease just :</p>
                    <a href="https://documenter.getpostman.com/view/27411059/2s93m5zgoi" target="_blank">here</a>
            </div>
        </footer>
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
                    this.conversionResult = response.data.conversion_amount; // Stockage du résultat de la conversion
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
};
</script>
  