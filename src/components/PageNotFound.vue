<template>
  <!-- Barre de navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <a class="navbar-brand mx-auto" href="/" alt="home">MoneyValue</a>
    </div>
  </nav>
  
  <div class="container">
    <div class="row justify-content-center align-items-center" style="min-height: 80vh;">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-body text-center">
            <h1 class="card-title">404</h1>
            <p class="card-text">Sorry, the page you are looking for cannot be found.</p>
            <router-link to="/" class="btn btn-primary">Home</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


  

 
  
<script>
export default {
  name: 'PageNotFound',
}
</script>

<style scoped>
.card {
  width: 100%;
}
</style>
  