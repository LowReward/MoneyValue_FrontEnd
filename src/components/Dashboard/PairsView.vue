<template>
    <div>
        <!-- Afficher la liste des paires si showCreateForm et showUpdateForm sont sur false -->
        <template v-if="!showCreateForm && !showUpdateForm">
            <!-- Affichage des messages de confirmation et d'erreur -->
            <div v-if="showConfirmationCreated" class="alert alert-success mt-4">Paires ajoutées avec succès.</div>
            <div v-if="showConfirmationUpdated" class="alert alert-success mt-4">Paire modifiée avec succès.</div>
            <div v-if="showConfirmationDelete" class="alert alert-danger mt-4">Paire supprimée avec succès.</div>
            <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>
            <div class="d-flex justify-content-center align-items-center mt-5">
                <h2>Liste des paires:</h2>
                <!-- Appel de la méthode toggleCreateForm pour afficher le form de création de paire -->
                <button class="btn btn-primary mx-5" @click="toggleCreateForm">Ajouter une paire</button>
            </div>
            <table class="table mt-4">
                <!-- Contenu du tableau -->
                <thead>
                    <tr>
                        <th scope="col">Paires</th>
                        <th scope="col">Nombre de requêtes</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- itération sur le tableau paginatedPairs avec une clé (:key) pour chaque élément de la boucle -->
                    <tr v-for="pair in paginatedPairs" :key="pair.id">
                        <!-- Affiche les devises contenues dans chaque élément -->
                        <td>{{ pair.currency_from }} - {{ pair.currency_to }}</td>
                        <!-- Affiche le nombre de requêtes aux pairs dans chaque élément -->
                        <td>{{ pair.request_count }}</td>
                        <td>
                            <!-- Bouton pour modifier une devise -->
                            <button class="btn btn-sm btn-primary " @click="editPair(pair)">Modifier</button>
                            <!-- Appel de la fonction deletePair avec la clé de l'élément en question -->
                            <button class="btn btn-sm btn-danger mx-2" @click="deletePair(pair)">Supprimer</button>
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
        <!-- Afficher le formulaire de création de paire -->
        <template v-if="showCreateForm">
            <!-- Si showCreateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-created
          reçu de notre CreatePairForm.vue, alors showCreateForm passe à false via la fonction onPairCreated-->
            <create-pair-form @pair-created="onPairCreated" @cancel="toggleCreateForm" />
        </template>
        <!-- Afficher le formulaire de mise à jour de paire -->
        <template v-if="showUpdateForm">
            <!-- Si showUpdateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-updated
          reçu de notre UpdatePairForm.vue, alors showUpdateForm passe à false via la fonction onPairUpdated-->
            <update-pair-form :pair="selectedPair" @pair-updated="onPairUpdated" @cancel="cancelUpdate" />
        </template>
    </div>
</template>

<script>
import axiosClient from '../../plugins/axios.js';
import CreatePairForm from './Form/CreatePairForm.vue';
import UpdatePairForm from './Form/UpdatePairForm.vue';

export default {
    name: 'PairsView',
    data() {
        return {
            pairs: [], // Tableau pour stocker les paires
            showCreateForm: false, // Indicateur pour afficher ou masquer le formulaire de création de paire
            showUpdateForm: false, // Indicateur pour afficher ou masquer le formulaire de mise à jour de paire
            selectedPair: null, // Paire sélectionnée pour la mise à jour
            showConfirmationCreated: false, // Indicateur pour afficher ou masquer la confirmation de création de paire
            showConfirmationUpdated: false, // Indicateur pour afficher ou masquer la confirmation de mise à jour de paire
            showConfirmationDelete: false, // Indicateur pour afficher ou masquer la confirmation de suppression de paire
            showErrorRandom: false, // Indicateur d'erreur aléatoire
            currentPage: 1, // Page actuelle
        };
    },

    mounted() {
        this.fetchPairs(); // Appelle la méthode fetchPairs lors du montage du composant
        this.paginatePairs(); // Pagination initiale
    },

    components: {
        CreatePairForm, // Composant enfant CreatePairForm utilisé pour créer une nouvelle paire
        UpdatePairForm, // Composant enfant UpdatePairForm utilisé pour mettre à jour une paire existante
    },

    watch: {
        pairs() {
            this.paginatePairs();
        },

        currentPage() {
            this.paginatePairs();
        },
    },

    methods: {
        fetchPairs() {
            axiosClient
                .get('http://localhost:8000/api/admin/pairs') // Effectue une requête GET pour récupérer les paires depuis l'API
                .then(response => {
                    this.pairs = response.data; // Stocke les paires dans le tableau "pairs"
                })
                .catch(error => {
                    console.error(error); // Affiche une erreur en cas d'échec de la requête
                });
        },

        toggleCreateForm() {
            this.showCreateForm = !this.showCreateForm; // Inverse la valeur de showCreateForm pour afficher ou masquer le formulaire de création de paire
        },

        onPairCreated() {
            this.showCreateForm = false; // Masque le formulaire de création de paire après la création réussie
            this.fetchPairs(); // Récupère à nouveau les paires pour mettre à jour la liste
            this.showConfirmationCreated = true; // Affiche la confirmation de création de paire
            setTimeout(() => {
                this.showConfirmationCreated = false; // Masque la confirmation après 3 secondes
            }, 3000);
        },

        editPair(pair) {
            this.selectedPair = pair; // Stocke la paire sélectionnée pour la mise à jour
            this.showUpdateForm = true; // Affiche le formulaire de mise à jour de paire
        },

        onPairUpdated() {
            this.showUpdateForm = false; // Masque le formulaire de mise à jour de paire après la mise à jour réussie
            this.fetchPairs(); // Récupère à nouveau les paires pour mettre à jour la liste
            this.showConfirmationUpdated = true; // Affiche la confirmation de mise à jour de paire
            setTimeout(() => {
                this.showConfirmationUpdated = false; // Masque la confirmation après 3 secondes
            }, 3000);
        },


        cancelUpdate() {
            this.showUpdateForm = false; // Annule la mise à jour et masque le formulaire de mise à jour de paire
        },

        paginatePairs() {
            // Calcul de l'indice de début et de fin pour la pagination en fonction de la page actuelle
            const startIndex = (this.currentPage - 1) * 8;
            const endIndex = startIndex + 8;

            // Extraction des paires paginées à partir du tableau original
            this.paginatedPairs = this.pairs.slice(startIndex, endIndex);
        },

        getPageNumbers() {
            // Calcul du nombre total de pages en fonction du nombre de paires et de la taille de pagination
            const pageCount = Math.ceil(this.pairs.length / 8);

            // Création d'un tableau contenant les numéros de page de 1 à pageCount
            return Array.from({ length: pageCount }, (_, index) => index + 1);
        },

        goToPage(page) {
            // Mise à jour de la page actuelle lorsque l'utilisateur clique sur un bouton de pagination
            this.currentPage = page;
        },



        deletePair(pair) {
            axiosClient
                .delete(`http://localhost:8000/api/admin/pairs/${pair.id}`) // Effectue une requête DELETE pour supprimer la paire spécifiée par son ID
                .then(response => {
                    console.log(response); // Affiche la réponse de la requête DELETE dans la console
                    this.fetchPairs(); // Récupère à nouveau les paires pour mettre à jour la liste
                    this.showConfirmationDelete = true; // Affiche la confirmation de suppression de paire
                    setTimeout(() => {
                        this.showConfirmationDelete = false; // Masque la confirmation après 3 secondes
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
