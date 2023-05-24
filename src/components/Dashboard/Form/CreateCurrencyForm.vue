<template>
  <div>
    <!-- Affichage des messages d'erreur -->
    <div v-if="showError422" class="alert alert-danger mt-4">Le code pour cette devise existe déjà.</div>
    <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>

    <!-- Formulaire pour ajouter une devise -->
    <div class="d-flex justify-content-between align-items-center mt-5">
      <h2>Ajouter une devise:</h2>
    </div>
    <!-- Formulaire pour ajouter une devise -->
    <form @submit.prevent="createCurrency">
      <!-- Champ pour le code de la devise -->
      <div class="form-group mt-4">
        <label for="currency_code">Code de la Devise:</label>
        <input class="form-control" id="currency_code" v-model="newCurrency.code" placeholder="EUR...USD..." required>
      </div>

      <!-- Champ pour le nom de la devise -->
      <div class="form-group mt-4">
        <label for="currency_name">Nom de la Devise:</label>
        <input class="form-control" id="currency_name" v-model="newCurrency.name" placeholder="Euros...Dollars Américain..." required>
      </div>

      <div class='mt-4'>
        <!-- Bouton pour soumettre le formulaire -->
        <button type="submit" class="btn btn-primary">Créer la devise</button>
        <!-- Bouton pour annuler et revenir en arrière -->
        <button type="button" class="btn btn-secondary mx-2" @click="cancelCreate">Annuler</button>
      </div>
    </form>
  </div>
</template>
  
<script>
import axiosClient from '../../../plugins/axios.js';

export default {
  name: 'CreateCurrencyForm',
  data() {
    return {
      newCurrency: {
        code: '',
        name: '',
      },
      showError422: false, // Indicateur pour afficher ou masquer l'erreur de code de devise existant
      showErrorRandom: false, // Indicateur pour afficher ou masquer une erreur aléatoire
    };
  },
  methods: {
    createCurrency() {
      // Effectue la requête HTTP pour créer la paire dans le backend
      axiosClient.post('http://localhost:8000/api/admin/currencies', this.newCurrency)
        .then(response => {
          // Gére la réussite de la création de la devise
          console.log(response),
            // Émet un événement pour informer le composant parent que la devise a été créée
            this.$emit('currency-created');
          console.log('Successfully created currency');
        })
        .catch(error => {
          // Gére l'erreur s'il y en a une
          if (error.response && error.response.status === 422) {
            // Gére l'erreur de validation avec le code 422
            this.showError422 = true,
              setTimeout(() => {
                this.showError422 = false; // Masque l'erreur après quelques secondes
              }, 5000);
            console.error('Validation error:', error.response.data.errors);
          } else {
            // Gére toutes les autres erreurs
            this.showErrorRandom = true, // Affiche l'erreur aléatoire correspondante
              setTimeout(() => {
                this.showErrorRandom = false; // Masque l'erreur après quelques secondes
              }, 5000);
            console.error('An error has occurred:', error);
          }
        });
    },
    cancelCreate() {
      // Émet un événement pour informer le composant parent d'annuler la création de la devise
      this.$emit('cancel');
    },
  }
};
</script>
  