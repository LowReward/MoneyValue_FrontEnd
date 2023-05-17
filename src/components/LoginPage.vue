<template>
    <form @submit.prevent="login">
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email">
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password">
        </div>
        <button type="submit">Login</button>
    </form>
</template>
  
<script>
import axios from 'axios';
import store from '../store';
export default {
    name: "LoginPage",
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            axios.post('http://localhost:8000/api/login', {
                email: this.email,
                password: this.password
            })
                .then(response => {
                    store.state.user.token = response.data.token;
                    console.log(store.state.user.token);
                    //this.$router.push()
                })
                .catch(error => {
                    console.log(error);
                });

        }
    }
}
</script>
  
<style scoped></style>