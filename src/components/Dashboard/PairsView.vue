<template>
    <div>
        <!-- Afficher la liste des paires si showCreateForm est false -->
        <template v-if="!showCreateForm">
            <div v-if="showConfirmation" class="alert alert-danger mt-4">Paire supprimée avec succès.</div>
            <div class="d-flex justify-content-between align-items-center mt-5">
                <h2>Liste des paires:</h2>
                <!-- Appel de la méthode toggleCreateForm pour afficher le form de création de paire -->
                <button class="btn btn-primary" @click="toggleCreateForm">Ajouter une paire</button>
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
                            <!-- Appel de la fonction deletePair avec la clé de l'élèment en question -->
                            <button class="btn btn-sm btn-danger" @click="deletePair(pair)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
        <!-- Afficher le formulaire de création de paire -->
        <template v-else>
            <!-- Si showCreateForm est sur true alors le form vient remplacer le tableau, une fois l'event pair-created
        reçu de notre CreatePairForm.vue, alors showCreateForm passe à false via la fonction onPaireCreated-->
            <create-pair-form v-if="showCreateForm" @pair-created="onPairCreated" />
        </template>
    </div>
</template>
  
<script>
import axiosClient from '../../plugins/axios.js';
import CreatePairForm from './Form/CreatePairForm.vue';

export default {
    name: 'PairsView',
    data() {
        return {
            // Tableau pour notre liste de paires
            pairs: [],
            // Boolean pour afficher ou non le form de creation (sur false par défaut)
            showCreateForm: false,
            // Boolean pour afficher ou non le message de suppresion (sur false par défaut)
            showConfirmation: false,
        };
    },
    mounted() {
        this.fetchPairs();
    },
    components: {
        CreatePairForm,
    },
    methods: {
        // Récupération de la liste des paires 
        fetchPairs() {
            axiosClient
                .get('http://localhost:8000/api/pairs')
                .then(response => {
                    this.pairs = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        toggleCreateForm() {
            this.showCreateForm = !this.showCreateForm;
        },
        onPairCreated() {
            // La paire a été créée avec succès, masquer le formulaire et afficher le tableau
            this.showCreateForm = false;
        },
        editPair(pair) {
            // Logique pour éditer la paire
            console.log('Édition de la paire:', pair);
        },
        deletePair(pair) {
            // Effectuer la requête HTTP pour supprimer la paire dans le backend (pair.id -> clé pointé depuis notre itération)
            axiosClient.delete(`http://localhost:8000/api/pairs/${pair.id}`)
                .then(response => {
                    console.log(response)
                    // Suppression réussie, mettre à jour la liste des paires
                    this.fetchPairs();
                    // showconfirmation à true pour afficher le message dans la condition associée
                    this.showConfirmation = true;
                    console.log('Paire supprimée avec succès');
                    // Timeout pour réinitialiser le message de suppression après 3 secondes
                    setTimeout(() => {
                        this.showConfirmation = false;
                    }, 3000);
                })
                .catch(error => {
                     
                    console.error(error);
                });
        }
    },
};
</script>
  