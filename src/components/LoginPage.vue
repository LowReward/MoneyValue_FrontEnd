<template>
    <form class="center" @submit.prevent="login">
        <div class="inputbox">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email">
        </div>
        <div class="inputbox">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password">
        </div>
        <button type="submit">Login</button>
    </form>
    <p v-if="loginError">{{ loginError }}</p>
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
                    this.$router.push('admin/dashboard')
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