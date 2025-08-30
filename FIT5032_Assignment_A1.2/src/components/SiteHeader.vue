<template>
  <nav class="she-navbar fixed-top">
    <div class="nav-inner">
   
      <router-link to="/" class="brand">SHE</router-link>

     
      <ul class="menu">
        <li><router-link to="/" class="nav-link">Podcasts</router-link></li>
        <li><router-link to="/live" class="nav-link">Live</router-link></li>
        <li><router-link to="/treehole" class="nav-link">Tree Hole</router-link></li>
        <li><router-link to="/discover" class="nav-link">Discover</router-link></li>
        <li><router-link to="/curve" class="nav-link">Emotional Curve</router-link></li>
        <li><router-link to="/cocreation" class="nav-link">Co-Creation</router-link></li>
        <li><router-link to="/profile" class="nav-link">Profile</router-link></li>
        <li><router-link to="/about" class="nav-link">About Policies</router-link></li>
      </ul>


      <ul class="auth">
        <li><router-link to="/login" class="nav-link">Login</router-link></li>
        <li><router-link to="/register" class="nav-link">Register</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>

.she-navbar {
  background: #151a4b;
  height: 64px;                
  display: flex;
  align-items: center;          
  padding: 0 16px;
}


.nav-inner {
  width: 100%;
  display: flex;
  align-items: center;         
  justify-content: space-between;
  gap: 16px;
}


.brand {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffb6c1;
  text-decoration: none;
  line-height: 1;              
  white-space: nowrap;
}


.menu {
  flex: 1;                     
  display: flex;
  justify-content: center;      
  align-items: center;          
  gap: 3rem;                   
  margin: 0;
  padding: 0;
  list-style: none;
}


.auth {
  display: flex;
  align-items: center;         
  gap: 1.5rem;                  
  margin: 0;
  padding: 0;
  list-style: none;
}


.nav-link {
  color: #ffb6c1;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: color .2s ease;
}
.nav-link:hover {
  color: #ffd8e6;
}


.brand, .nav-link {
  display: inline-flex;
  align-items: center;
  height: 64px;                
}


</style>