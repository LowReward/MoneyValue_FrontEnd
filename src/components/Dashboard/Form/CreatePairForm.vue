<template>
    <div>
        <!-- Affichage du message d'erreur générique en cas d'erreur -->
        <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>
        <!-- Titre du formulaire -->
        <div class="d-flex justify-content-center align-items-center mt-5">
            <h2>Ajouter une paire:</h2>
        </div>
        <!-- Formulaire pour ajouter une paire -->
        <form @submit.prevent="createPair">
            <!-- Champ pour la devise de départ -->
            <div class="form-group mt-4">
                <label for="currencyFrom">Devises (depuis):</label>
                <select class="form-control" id="currencyFrom" v-model="newPair.currency_from" required>
                    <!-- Boucle sur les devises pour créer les options du select -->
                    <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                        {{ currency.name }} ({{ currency.code }})
                    </option>
                </select>
            </div>

            <!-- Champ pour la devise d'arrivée -->
            <div class="form-group mt-4">
                <label for="currencyTo">Devises (vers):</label>
                <select class="form-control" id="currencyTo" v-model="newPair.currency_to" required>
                    <!-- Boucle sur les devises filtrées pour créer les options du select -->
                    <option v-for="currency in fiteredCurrencies" :key="currency.code" :value="currency.code">
                        {{ currency.name }} ({{ currency.code }})
                    </option>
                </select>
            </div>
            <!-- Champ pour le taux de conversion -->
            <div class="form-group mt-4">
                <label for="conversion_rate">Taux de conversion:</label>
                <input type="number" class="form-control" id="conversion_rate" placeholder="0" min="0" max="999999"
                    pattern="^[0-9]+(\.[0-9]{1,2})?$" step="0.01" v-model="newPair.conversion_rate" required>
            </div>

            <div class='mt-4 '>
                <!-- Bouton pour soumettre le formulaire -->
                <button type="submit" class="btn btn-primary ">Créer la paire</button>
                <!-- Bouton pour annuler et revenir en arrière -->
                <button type="button" class="btn btn-secondary mx-2" @click="cancelCreate">Annuler</button>
            </div>
            <p class="mt-3">La paire inverse sera créee automatiquement</p>
        </form>
    </div>
</template>
  
<script>
import axiosClient from '../../../plugins/axios.js';

export default {
    name: 'CreatePairForm',
    data() {
        return {
            // Tableau contenant la nouvelle pair à créer
            newPair: {
                currency_from: '',
                currency_to: '',
                conversion_rate: '',
            },
            // Tableau contenant les devises
            currencies: [],

            showErrorRandom: false,
        };
    },
    mounted() {
        this.fetchCurrencies();
    },
    computed: {
        fiteredCurrencies() {
            // Filtre dans notre tableau des devises fetched 
            // On vérifie si le code de la devise sélectionné est différent de la première partie du formulaire ( depuis => this.newPair.CURRENCY_FROM )
            // La nouvelle liste de devise filtrée est donc retournée sans celle selectionnée dans la première partie, on évite donc de pouvoir la sélectionnée dans les 2 en même temps
            return this.currencies.filter(currency => currency.code !== this.newPair.currency_from)
        }
    },
    methods: {
        fetchCurrencies() {
            axiosClient.get('http://localhost:8000/api/admin/currencies')
                .then(response => {
                    this.currencies = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        createPair() {
            // Effectue la requête HTTP pour créer la paire dans le backend
            axiosClient.post('http://localhost:8000/api/admin/pairs', this.newPair)
                .then(response => {
                    console.log(response),
                        console.log('Paire créée avec succès');
                    this.generateInversePair();
                })
                .catch(error => {
                    // Gére l'erreur s'il y en a une
                    console.error(error);
                });
        },

        generateInversePair() {
            const inversePair = {
                currency_from: this.newPair.currency_to,
                currency_to: this.newPair.currency_from,
                conversion_rate: (1 / this.newPair.conversion_rate).toFixed(2),
            };

            // Envoie la requête HTTP pour créer la paire inverse
            axiosClient.post('http://localhost:8000/api/admin/pairs', inversePair)
                .then(response => {
                    console.log(response);
                    this.$emit('pair-created');
                    console.log('Paire inverse créée avec succès');
                })
                .catch(error => {
                    // Gére toutes les erreurs
                    this.showErrorRandom = true,
                        setTimeout(() => {
                            this.showErrorRandom = false;
                        }, 5000);
                    console.error('Une erreur s\'est produite :', error);
                });
        },

        cancelCreate() {
            // Émet un événement pour informer le composant parent d'annuler la création de la paire
            this.$emit('cancel');
        },
    }
};
</script>
  