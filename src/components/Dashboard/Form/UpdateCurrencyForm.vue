<template>
    <div>
      <h3>Modifier une devise</h3>
      <form @submit.prevent="updateCurrency">
        <div class="form-group">
          <label for="currency_code">Code de la Devise:</label>
          <input class="form-control" id="currency_code" v-model="updatedCurrency.code">
        </div>
  
        <div class="form-group">
          <label for="currency_name">Nom de la Devise:</label>
          <input class="form-control" id="currency_name" v-model="updatedCurrency.name">
        </div>
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
        <button type="button" class="btn btn-secondary" @click="cancelUpdate">Annuler</button>
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
    };
  },
  created() {
    this.updatedCurrency = { ...this.currency }; // Effectue une copie de la paire pour éviter de modifier la prop directement
  },
  methods: {
    updateCurrency() {
      axiosClient
        .put(`http://localhost:8000/api/currencies/${this.updatedCurrency.id}`, {
          code: this.updatedCurrency.code,
          name: this.updatedCurrency.name,
        })
        .then(response => {
          console.log(response);
          this.$emit('currency-updated');
        })
        .catch(error => {
          console.error(error);
        });
    },
    cancelUpdate() {
      this.$emit('cancel');
    },
  },
};
</script>
