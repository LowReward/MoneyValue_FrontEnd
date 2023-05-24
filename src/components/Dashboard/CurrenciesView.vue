<template>
    <div>
        <!-- Afficher la liste des paires si showCreateForm et showUpdateForm sont sur false -->
        <template v-if="!showCreateForm && !showUpdateForm">
            <!-- Affichage des messages de confirmation et d'erreur -->
            <div v-if="showConfirmationCreated" class="alert alert-success mt-4">Devise créée avec succès.</div>
            <div v-if="showConfirmationUpdated" class="alert alert-success mt-4">Devise modifiée avec succès.</div>
            <div v-if="showConfirmationDeleted" class="alert alert-danger mt-4">Devise supprimée avec succès.</div>
            <!-- Affichage du message d'erreur générique en cas d'erreur -->
            <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>
            <div class="d-flex justify-content-center align-items-center mt-5">
                <h2>Liste des devises:</h2>
                <!-- Appel de la méthode toggleCreateForm pour afficher le formulaire de création de devise -->
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
                    <!-- Itération sur le tableau paginatedCurrencies avec une clé (:key) pour chaque élément de la boucle -->
                    <tr v-for="currency in paginatedCurrencies" :key="currency.id">
                        <!-- Affiche les devises contenues dans chaque élément -->
                        <td>{{ currency.name }} - {{ currency.code }}</td>
                        <td>
                            <!-- Bouton pour modifier une devise -->
                            <button class="btn btn-sm btn-primary" @click="editCurrency(currency)">Modifier</button>
                            <!-- Appel de la fonction deleteCurrency avec la clé de l'élément en question -->
                            <button class="btn btn-sm btn-danger mx-2" @click="deleteCurrency(currency)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Ajout des boutons de pagination -->
            <div class="pagination mt-4 d-flex justify-content-center">
                <!-- Utilisation d'une boucle v-for pour générer les boutons -->
                <!-- La méthode getPageNumbers() retourne une liste des numéros de page, 
                ajoute la classe active au bouton de la page courante, en fonction de la valeur de currentPage
                et goToPage(page) est déclenché lorsqu'un bouton de pagination est cliqué-->
                <button v-for="page in getPageNumbers()" :key="page" class="btn btn-sm btn-primary mx-1"
                    :class="{ 'active': page === currentPage }" @click="goToPage(page)">
                    <!-- Affichage du numéro de page -->
                    {{ page }}
                </button>
            </div>

        </template>

        <!-- Afficher le formulaire de création de devise -->
        <template v-if="showCreateForm">
            <!-- Si showCreateForm est sur true alors le formulaire vient remplacer le tableau -->
            <create-currency-form @currency-created="onCurrencyCreated" @cancel="toggleCreateForm" />
        </template>

        <!-- Afficher le formulaire de mise à jour de devise -->
        <template v-if="showUpdateForm">
            <!-- Si showUpdateForm est sur true alors le formulaire vient remplacer le tableau -->
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
            currentPage: 1, // Page actuelle
        };
    },

    mounted() {
        this.fetchCurrencies(); // Récupérer les devises lors du montage du composant
        this.paginateCurrencies(); // Pagination initiale
    },

    components: {
        CreateCurrencyForm, // Composant enfant CreateCurrencyForm utilisé pour créer une nouvelle devise
        UpdateCurrencyForm, // Composant enfant UpdateCurrencyForm utilisé pour mettre à jour une devise existante
    },

    watch: {
        currencies() {
            this.paginateCurrencies();
        },

        currentPage() {
            this.paginateCurrencies();
        },
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
                    // Gérer toutes les erreurs
                    this.showErrorRandom = true; // Affiche l'erreur aléatoire
                    setTimeout(() => {
                        this.showErrorRandom = false; // Cache l'erreur après 5 secondes
                    }, 5000);
                    console.error("An error has occurred:", error);
                });
        },

        toggleCreateForm() {
            this.showCreateForm = !this.showCreateForm; // Inverse la valeur de showCreateForm pour afficher ou masquer le formulaire de création
        },

        onCurrencyCreated() {
            this.showCreateForm = false; // Masque le formulaire de création
            this.fetchCurrencies(); // Récupérer à nouveau les devises pour afficher la mise à jour de la liste
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
            this.fetchCurrencies(); // Récupérer à nouveau les devises pour afficher la mise à jour de la liste
            this.showConfirmationUpdated = true; // Affiche le message de confirmation de mise à jour
            setTimeout(() => {
                this.showConfirmationUpdated = false; // Cache le message de confirmation après 3 secondes
            }, 3000);
        },

        cancelUpdate() {
            this.showUpdateForm = false; // Masque le formulaire de mise à jour en cas d'annulation
        },

        paginateCurrencies() {
            // Calcul de l'indice de début et de fin pour la pagination en fonction de la page actuelle
            const startIndex = (this.currentPage - 1) * 8;
            const endIndex = startIndex + 8;

            // Extraction des paires paginées à partir du tableau original
            this.paginatedCurrencies = this.currencies.slice(startIndex, endIndex);
        },

        getPageNumbers() {
            // Calcul du nombre total de pages en fonction du nombre de paires et de la taille de pagination
            const pageCount = Math.ceil(this.currencies.length / 8);
            // Création d'un tableau contenant les numéros de page de 1 à pageCount
            return Array.from({ length: pageCount }, (_, index) => index + 1);
        },

        goToPage(page) {
            // Mise à jour de la page actuelle lorsque l'utilisateur clique sur un bouton de pagination
            this.currentPage = page;
        },

        deleteCurrency(currency) {
            // Supprime une devise en appelant l'API
            axiosClient
                .delete(`http://localhost:8000/api/admin/currencies/${currency.id}`)
                .then(response => {
                    console.log(response);
                    this.fetchCurrencies(); // Récupérer à nouveau les devises pour afficher la mise à jour de la liste
                    this.showConfirmationDeleted = true; // Affiche le message de confirmation de suppression
                    setTimeout(() => {
                        this.showConfirmationDeleted = false; // Cache le message de confirmation après 3 secondes
                    }, 3000);
                })
                .catch(error => {
                    // Gérer toutes les erreurs
                    this.showErrorRandom = true; // Affiche l'erreur aléatoire
                    setTimeout(() => {
                        this.showErrorRandom = false; // Cache l'erreur après 5 secondes
                    }, 5000);
                    console.error("An error has occurred:", error);
                });
        },
    },
};
</script>
  