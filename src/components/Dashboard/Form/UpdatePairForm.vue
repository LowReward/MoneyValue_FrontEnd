<template>
    <div>
        <!-- Affichage du message d'erreur générique en cas d'erreur -->
        <div v-if="showErrorRandom" class="alert alert-danger mt-4">Une erreur s'est produite, veuillez réessayer.</div>
        <!-- Titre du formulaire -->
        <h3>Modifier une paire</h3>
        <!-- Formulaire de modification de la paire -->
        <form @submit.prevent="updatePair">
            <!-- Champ pour la devise (depuis) -->
            <div class="form-group mt-4">
                <label for="currencyFrom">Devises (depuis)</label>
                <select v-model="updatedPair.currency_from" placeholder="Selectionnez une devise (depuis)"
                    class="form-control" required>
                    <option v-for="currency in currencies" :value="currency.code" :key="currency.code">
                        {{ currency.code }}
                    </option>
                </select>
            </div>

            <!-- Champ pour la devise (vers) -->
            <div class="form-group mt-4">
                <label for="currencyTo">Devises (vers)</label>
                <select v-model="updatedPair.currency_to" placeholder="Selectionnez une devise (vers)" class="form-control"
                    required>
                    <option v-for="currency in fiteredCurrencies" :value="currency.code" :key="currency.code">
                        {{ currency.code }}
                    </option>
                </select>
            </div>
            <!-- Champ pour le taux de conversion -->
            <div class="form-group mt-4">
                <label for="conversionRate">Taux de conversion</label>
                <input v-model="updatedPair.conversion_rate" type="number" class="form-control" id="conversionRate" min="0"
                    max="999999" pattern="^[0-9]+(\.[0-9]{1,2})?$" step="0.01" required>
            </div>


            <div class='mt-4 '>
                <!-- Bouton pour mettre à jour la paire -->
                <button type="submit" class="btn btn-primary ">Mettre à jour</button>
                <!-- Bouton pour annuler et revenir en arrière -->
                <button type="button" class="btn btn-secondary mx-2" @click="cancelUpdate">Annuler</button>
            </div>
        </form>
    </div>
</template>
  

<script>
import axiosClient from '../../../plugins/axios.js';

export default {
    name: 'UpdatePairForm',
    props: {
        pair: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            updatedPair: null,
            currencies: [], // Liste des devises existantes
            selectedCurrency: null, // Devise sélectionnée
            showErrorRandom: false, // Indicateur d'erreur aléatoire
        };
    },
    created() {
        this.updatedPair = { ...this.pair }; // Effectue une copie de la paire pour éviter de modifier la prop directement
        this.fetchCurrencies(); // Appel de la méthode pour récupérer la liste des devises
    },
    computed: {
        fiteredCurrencies() {
            // Filtre dans notre tableau des devises fetched 
            // On vérifie si le code de la devise sélectionné est différent de la première partie du formulaire ( depuis => this.newPair.CURRENCY_FROM )
            // La nouvelle liste de devise filtrée est donc retournée sans celle selectionnée dans la première partie, on évite donc de pouvoir la sélectionnée dans les 2 en même temps
            return this.currencies.filter(currency => currency.code !== this.updatedPair.currency_from)
        }
    },
    methods: {
        // Méthode pour récupérer la liste des devises disponibles depuis l'API
        fetchCurrencies() {
            axiosClient.get('http://localhost:8000/api/admin/currencies')
                .then(response => {
                    // Une fois la réponse obtenue avec succès, la liste des devises est assignée à la propriété "currencies"
                    this.currencies = response.data;
                    // Sélectionne la devise correspondant à la paire à éditer et l'assigne à la propriété "selectedCurrency"

                    this.selectedCurrency = this.pair.currency_from; // Sélectionne la devise de la paire à éditer
                })
                .catch(error => {
                    // En cas d'erreur lors de la requête, l'erreur est affichée dans la console

                    console.error(error);
                });
        },
        updatePair() {
            // Effectue une requête PUT à l'API pour mettre à jour la paire avec les nouvelles valeurs
            axiosClient
                .put(`http://localhost:8000/api/admin/pairs/${this.pair.id}`, {
                    currency_from: this.updatedPair.currency_from,
                    currency_to: this.updatedPair.currency_to,
                    conversion_rate: this.updatedPair.conversion_rate,
                })
                .then(response => {
                    // Si la requête est réussie, affiche la réponse dans la console
                    console.log(response);
                    // Émet l'événement "pair-updated" vers le composant parent pour indiquer la mise à jour réussie de la paire
                    this.$emit('pair-updated');
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
        cancelUpdate() {
            // Émet l'événement "cancel" vers le composant parent pour indiquer l'annulation de la mise à jour
            this.$emit('cancel');
        },
    },
};
</script>
