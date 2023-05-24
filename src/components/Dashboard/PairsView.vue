<template>
    <div>
        <!-- Afficher la liste des paires si showCreateForm et showUpdateForm sont sur false -->
        <template v-if="!showCreateForm && !showUpdateForm">
            <div v-if="showConfirmationCreated" class="alert alert-success mt-4">Paires ajoutées avec succès.</div>
            <div v-if="showConfirmationUpdated" class="alert alert-success mt-4">Paire modifiée avec succès.</div>
            <div v-if="showConfirmationDelete" class="alert alert-danger mt-4">Paire supprimée avec succès.</div>
            <div class="d-flex justify-content-center align-items-center mt-5 ">
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
                    <!-- itération sur le tableau pairs avec une clé (:key) pour chaque élément de la boucle -->
                    <tr v-for="pair in pairs" :key="pair.id">
                        <!-- Affiche les devises contenues dans chaque élément -->
                        <td>{{ pair.currency_from }} - {{ pair.currency_to }}</td>
                        <!-- Affiche le nombre de requêtes aux pairs dans chaque élément -->
                        <td>{{ pair.request_count }}</td>
                        <td>
                            <!-- À venir -->
                            <button class="btn btn-sm btn-primary " @click="editPair(pair)">Modifier</button>
                            <!-- Appel de la fonction deletePair avec la clé de l'élément en question -->
                            <button class="btn btn-sm btn-danger mx-2" @click="deletePair(pair)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
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
        };
    },

    mounted() {
        this.fetchPairs(); // Appelle la méthode fetchPairs lors du montage du composant
    },

    components: {
        CreatePairForm, // Composant enfant CreatePairForm utilisé pour créer une nouvelle paire
        UpdatePairForm, // Composant enfant UpdatePairForm utilisé pour mettre à jour une paire existante
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
                    console.error(error); // Affiche une erreur en cas d'échec de la requête
                });
        },
    },
};
</script>
  
<style>
/* Ajustement de l'apparence du router-view */
.router-view-container {
    min-height: 300px;
    /* Hauteur minimale souhaitée */
    padding: 20px;
    /* Espace intérieur pour le contenu */
}
</style>
