<template>
    <div>
        <!-- Barre de navigation -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand mx-auto" href="#">MoneyValue</a>
            </div>
        </nav>


        <!-- Affichage d'une alerte d'erreur en cas d'échec de requête -->
        <div v-if="showErrorRandom" class="alert alert-danger mt-4">An error has occurred, please
            try again.</div>
        <div class="container mt-5">
            <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
                <div class="col-md-6">
                    <h2>Currency converter</h2>

                    <!-- Formulaire de conversion -->
                    <div class=" form-group mt-4">
                        <!-- Sélection de la devise source -->
                        <div class="form-group">
                            <label for="pairFrom">Currency From :</label>
                            <select id="pairFrom" class="form-control" v-model="selectedPairFrom" @change="filterPairs"
                                required>
                                <option v-for="currency in uniqueCurrenciesFrom" :key="currency" :value="currency">{{
                                    currency }}</option>
                            </select>
                        </div>

                        <!-- Sélection de la devise cible -->
                        <div class="form-group mt-4">
                            <label for="pairTo">Currency To :</label>
                            <select id="pairTo" class="form-control" v-model="selectedPairTo" required>
                                <option v-for="currency in filteredCurrenciesTo" :key="currency" :value="currency">{{
                                    currency }}</option>
                            </select>
                        </div>

                        <!-- Saisie du montant à convertir -->
                        <div class="form-group mt-4">
                            <label for="amount">Amount to convert :</label>
                            <input id="amount" class="form-control" type="number" v-model="amount" min="0.000000"
                                max="999999" pattern="^[0-9]+(\.[0-9]{1,6})?$" step="0.000001" required />
                        </div>

                        <!-- Bouton de conversion -->
                        <button class="btn btn-primary mt-4" @click="convert">Convert</button>
                    </div>

                    <!-- Affichage du résultat de conversion -->
                    <div v-if="conversionResult" class="text-center mt-4">
                        Conversion result : {{ conversionResult }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Pied de page -->
        <footer class="footer mt-5"
            style="background-color: #f8f9fa; padding: 20px 0; bottom: 0; position: fixed; width: 100%;">
            <div class="container ">
                <p>Welcome to MoneyValue, the currency conversion platform designed specifically for
                    developers. Access our free and powerful REST API to perform currency conversions
                    with ease just here :</p>
                <a href="https://documenter.getpostman.com/view/27411059/2s93m5zgoi" target="_blank"
                    alt='Open tab to Api Documentation Page'>Click on me</a>
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
            showErrorRandom: false, // Indicateur d'erreur aléatoire
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
                    // Gére toutes les erreurs
                    this.showErrorRandom = true,
                        setTimeout(() => {
                            this.showErrorRandom = false;
                        }, 5000);
                    console.error('An error has occurred:', error);
                });
        },
        filterPairs() {
            this.selectedPairTo = ''; // Réinitialisation de la devise de retour sélectionnée lors du changement de la devise de départ
        },
        convert() {
            if (!this.selectedPairFrom || !this.selectedPairTo || !this.amount) {
                // Vérification si les champs sont vides
                alert('Please select the currencies and enter a valid amount.');
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
                    // Gére toutes les erreurs
                    this.showErrorRandom = true,
                        setTimeout(() => {
                            this.showErrorRandom = false;
                        }, 5000);
                    console.error('An error has occurred:', error);
                });
        },
    },
};
</script>
  