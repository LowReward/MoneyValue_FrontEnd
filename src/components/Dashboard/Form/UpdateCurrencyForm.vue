<template>
  <div>
    <div v-if="showError422" class="alert alert-danger mt-4">Le code pour cette devise existe déjà.</div>
    <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>
    <h3>Modifier une devise</h3>
    <form @submit.prevent="updateCurrency">
      <div class="form-group mt-4">
        <label for="currency_code">Code de la Devise:</label>
        <input class="form-control" id="currency_code" v-model="updatedCurrency.code">
      </div>

      <div class="form-group mt-4">
        <label for="currency_name">Nom de la Devise:</label>
        <input class="form-control" id="currency_name" v-model="updatedCurrency.name">
      </div>
      <div class='mt-4 '>
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
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
      showError422: false,
      showErrorRandom: false,
    };
  },
  created() {
    this.updatedCurrency = { ...this.currency }; // Effectue une copie de la paire pour éviter de modifier la prop directement
  },
  methods: {
    updateCurrency() {
      axiosClient
        .put(`http://localhost:8000/api/admin/currencies/${this.updatedCurrency.id}`, {
          code: this.updatedCurrency.code,
          name: this.updatedCurrency.name,
        })
        .then(response => {
          console.log(response);
          this.$emit('currency-updated');
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
      this.$emit('cancel');
    },
  },
};
</script>
