<template>
    <div class="container">
      <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Connexion</h3>
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">Email:</label>
                  <input type="email" id="email" v-model="email" class="form-control">
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password:</label>
                  <input type="password" id="password" v-model="password" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
              </form>
            </div>
          </div>
          <p v-if="loginError" class="mt-3 text-danger">{{ loginError }}</p>
        </div>
      </div>
    </div>
  </template>
  
  
<script>
import axios from 'axios';
import store from '../store';
export default {
    name: "LoginPage",
    data() {
        return {
            email: '',
            password: '',
            loginError: ''
        }
    },
    methods: {
        login() {
            axios.post('http://localhost:8000/api/login', {
                email: this.email,
                password: this.password
            })
                .then(response => {
                    //Récupération du token dans la réponse et ensuite store dans le state user token ( Vuex )
                    store.state.user.token = response.data.token;
                    console.log(store.state.user.token);
                    this.$router.push('/admin/dashboard/pairs')
                })
                .catch(error => {
                    console.log(error);
                    this.loginError = 'Login incorrect. Veuillez réessayer.';
                });

        }
    }
}
</script>
  
<style scoped>

</style>