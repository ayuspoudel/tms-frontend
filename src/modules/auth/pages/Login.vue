<template>
  
  <div class="login-wrapper">
    <BrandHeader />
    <div class="login-card">
        
      <div class="login-header">
        <h1>Welcome</h1>
        <p>Please log in to continue</p>
      </div>

      

      <form class="login-form" @submit.prevent="handleLogin">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="you@example.com" required />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" required />

        <button type="submit">Log In</button>
      </form>

      <div class="login-footer">
        <p>
          Don’t have an account?
          <router-link to="/signup">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../store/auth";
import BrandHeader from "@/components/BrandHeader.vue";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
  try {
    await auth.login(email.value, password.value);
    router.push("/dashboard");
  } catch (err) {
    alert("Login failed. Please check your credentials.");
  }
}
</script>
