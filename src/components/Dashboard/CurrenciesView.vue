<template>
    <div>
        <!-- Afficher la liste des paires si showCreateForm et showUpdateForm sont sur false -->
        <template v-if="!showCreateForm && !showUpdateForm">
            <div v-if="showConfirmationCreated" class="alert alert-success mt-4">Devise créee avec succès.</div>
            <div v-if="showConfirmationUpdated" class="alert alert-success mt-4">Devise modifiée avec succès.</div>
            <div v-if="showConfirmationDeleted" class="alert alert-danger mt-4">Devise supprimée avec succès.</div>
            <!-- Affichage du message d'erreur générique en cas d'erreur -->
            <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>
            <div class="d-flex justify-content-center align-items-center mt-5">
                <h2>Liste des devises:</h2>
                <!-- Appel de la méthode toggleCreateForm pour afficher le form de création de paire -->
                <button class="btn btn-primary mx-5" @click="toggleCreateForm">Ajouter une devise</button>
            </div>
            <table class="table  mt-5">
                <!-- Tableau affichant les devises -->
                <thead>
                    <tr>
                        <th scope="col">Devises</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- itération sur le tableau pairs avec une clé (:key) pour chaque élément de la boucle -->
                    <tr v-for="currency in currencies" :key="currency.id">
                        <!-- Affiche les devises contenues dans chaque élément -->
                        <td>{{ currency.name }} - {{ currency.code }}</td>
                        <td>
                            <!-- Bouton pour modifier une devise -->
                            <button class="btn btn-sm btn-primary " @click="editCurrency(currency)">Modifier</button>
                            <!-- Appel de la fonction deletePair avec la clé de l'élément en question -->
                            <button class="btn btn-sm btn-danger mx-2" @click="deleteCurrency(currency)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
        <!-- Afficher le formulaire de création de paire -->
        <template v-if="showCreateForm">
            <!-- Si showCreateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-created
          reçu de notre CreatePairForm.vue, alors showCreateForm passe à false via la fonction onPairCreated-->
            <create-currency-form @currency-created="onCurrencyCreated" @cancel="toggleCreateForm" />
        </template>
        <!-- Afficher le formulaire de mise à jour de paire -->
        <template v-if="showUpdateForm">
            <!-- Si showUpdateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-updated
          reçu de notre UpdatePairForm.vue, alors showUpdateForm passe à false via la fonction onPairUpdated-->
            <update-currency-form :currency="selectedCurrency" @currency-updated="onCurrencyUpdated"
                @cancel="cancelUpdate" />
        </template>
    </div>
</template>
  
<script>
import axiosClient from '../../plugins/axios.js';
import CreateCurrencyForm from './Form/CreateCurrencyForm.vue';
import UpdateCurrencyForm from './Form/UpdateCurrencyForm.vue';

export default {
    name: 'CurrenciesView',
    data() {
        return {
            currencies: [], // Liste des devises
            showCreateForm: false, // Indicateur d'affichage du formulaire de création
            showUpdateForm: false, // Indicateur d'affichage du formulaire de mise à jour
            selectedCurrency: null, // Devise sélectionnée pour la mise à jour
            showConfirmationCreated: false, // Indicateur de confirmation de création
            showConfirmationUpdated: false, // Indicateur de confirmation de mise à jour
            showConfirmationDeleted: false, // Indicateur de confirmation de suppression
            showErrorRandom: false, // Indicateur d'erreur aléatoire
        };
    },

    mounted() {
        this.fetchCurrencies(); // Récupérer les devises lors du montage du composant
    },

    components: {
        CreateCurrencyForm, // Composant enfant CreateCurrencyForm utilisé pour créer une nouvelle devise
        UpdateCurrencyForm, // Composant enfant UpdateCurrencyForm utilisé pour mettre à jour une devise existante
    },

    methods: {
        fetchCurrencies() {
            // Appel à l'API pour récupérer la liste des devises
            axiosClient
                .get('http://localhost:8000/api/admin/currencies')
                .then(response => {
                    this.currencies = response.data; // Assigne les devises à la propriété currencies
                })
                .catch(error => {
                    console.error(error);
                });
        },

        toggleCreateForm() {
            this.showCreateForm = !this.showCreateForm; // Inverse la valeur de showCreateForm pour afficher ou masquer le formulaire de création
        },

        onCurrencyCreated() {
            this.showCreateForm = false; // Masque le formulaire de création
            this.fetchCurrencies(); // Récupére à nouveau les devises pour afficher la mise à jour de la liste
            this.showConfirmationCreated = true; // Affiche le message de confirmation de création
            setTimeout(() => {
                this.showConfirmationCreated = false; // Cache le message de confirmation après 3 secondes
            }, 3000);
        },

        editCurrency(currency) {
            this.selectedCurrency = currency; // Assigne la devise sélectionnée à selectedCurrency pour la mise à jour
            this.showUpdateForm = true; // Affiche le formulaire de mise à jour
        },

        onCurrencyUpdated() {
            this.showUpdateForm = false; // Masque le formulaire de mise à jour
            this.fetchCurrencies(); // Récupére à nouveau les devises pour afficher la mise à jour de la liste
            this.showConfirmationUpdated = true; // Affiche le message de confirmation de mise à jour
            setTimeout(() => {
                this.showConfirmationUpdated = false; // Cache le message de confirmation après 3 secondes
            }, 3000);
        },


        cancelUpdate() {
            this.showUpdateForm = false; // Masque le formulaire de mise à jour en cas d'annulation
        },


        deleteCurrency(currency) {
            // Supprime une devise en appelant l'API
            axiosClient
                .delete(`http://localhost:8000/api/admin/currencies/${currency.id}`)
                .then(response => {
                    console.log(response);
                    this.fetchCurrencies(); // Récupére à nouveau les devises pour afficher la mise à jour de la liste
                    this.showConfirmationDeleted = true; // Affiche le message de confirmation de suppression
                    setTimeout(() => {
                        this.showConfirmationDeleted = false; // Cache le message de confirmation après 3 secondes
                    }, 3000);
                })
                .catch(error => {
                    // Gére toutes les erreurs
                    this.showErrorRandom = true, // Affiche l'erreur aléatoire
                        setTimeout(() => {
                            this.showErrorRandom = false; // Cache l'erreur après 5 secondes
                        }, 5000);
                    console.error('Une erreur s\'est produite :', error);
                });
        },
    },
};
</script>
  