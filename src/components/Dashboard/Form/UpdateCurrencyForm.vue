<template>
  <div>
    <!-- Affichage du message d'erreur en cas de code de devise déjà existant -->
    <div v-if="showError422" class="alert alert-danger mt-4">Le code pour cette devise existe déjà.</div>
    <!-- Affichage du message d'erreur générique en cas d'autres erreurs -->
    <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>
    <!-- Titre du formulaire -->
    <h3>Modifier une devise</h3>
    <!-- Formulaire de modification de la devise -->
    <form @submit.prevent="updateCurrency">
      <!-- Champ pour le code de la devise -->
      <div class="form-group mt-4">
        <label for="currency_code">Code de la Devise:</label>
        <input class="form-control" id="currency_code" v-model="updatedCurrency.code" placeholder="EUR...USD..." required>
      </div>

      <!-- Champ pour le nom de la devise -->
      <div class="form-group mt-4">
        <label for="currency_name">Nom de la Devise:</label>
        <input class="form-control" id="currency_name" v-model="updatedCurrency.name" placeholder="Euros...Dollars Américain..." required>
      </div>
      <div class='mt-4 '>
        <!-- Bouton pour mettre à jour la devise -->
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
        <!-- Bouton pour annuler et revenir en arrière -->
        <button type="button" class="btn btn-secondary mx-2" @click="cancelUpdate">Annuler</button>
      </div>
    </form>
  </div>
</template>
  

<script>
import axiosClient from '../../../plugins/axios.js';

export default {
  name: 'UpdateCurrencyForm',
  props: {
    currency: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      updatedCurrency: {},
      showError422: false, // Indicateur d'erreur 422
      showErrorRandom: false, // Indicateur d'erreur aléatoire
    };
  },
  created() {
    this.updatedCurrency = { ...this.currency }; // Effectue une copie de la paire pour éviter de modifier la prop directement
  },
  methods: {
    updateCurrency() {
      // Effectue la requête HTTP pour mettre à jour la devise dans le backend
      axiosClient
        .put(`http://localhost:8000/api/admin/currencies/${this.updatedCurrency.id}`, {
          code: this.updatedCurrency.code,
          name: this.updatedCurrency.name,
        })
        .then(response => {
          console.log(response);
          this.$emit('currency-updated'); // Émet un événement pour informer le composant parent de la mise à jour de la devise
        })
        .catch(error => {
          // Gére l'erreur s'il y en a une
          if (error.response && error.response.status === 422) {
            // Gére l'erreur de validation avec le code 422
            this.showError422 = true,
              setTimeout(() => {
                this.showError422 = false;
              }, 5000);
            console.error('Erreur de validation :', error.response.data.errors);
          } else {
            // Gére toutes les autres erreurs
            this.showErrorRandom = true,
              setTimeout(() => {
                this.showErrorRandom = false;
              }, 5000);
            console.error('Une erreur s\'est produite :', error);
          }
        });
    },
    cancelUpdate() {
      // Émet un événement pour informer le composant parent d'annuler la mise à jour de la devise
      this.$emit('cancel');
    },
  },
};
</script>
