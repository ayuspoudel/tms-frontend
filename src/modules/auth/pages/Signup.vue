<template>
  <div class="login-wrapper">
    <BrandHeader />
    <div class="login-card">
      <div class="login-header">
        <h1>Create Account</h1>
        <p>Fill in the details to get started</p>
      </div>

      <form class="login-form" @submit.prevent="handleSignup">
        <label>First Name</label>
        <input v-model="firstName" type="text" placeholder="Ayush" required />

        <label>Last Name</label>
        <input v-model="lastName" type="text" placeholder="Poudel" required />

        <label>Username</label>
        <input v-model="username" type="text" placeholder="ayuspoudel" required />

        <label>Email</label>
        <input v-model="email" type="email" placeholder="ayushpoudel@gmail.com" required />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" required />

        <button type="submit">Sign Up</button>
      </form>

      <div class="login-footer">
        <p>Already have an account?
          <router-link to="/login">Log in</router-link>
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

const firstName = ref("");
const lastName = ref("");
const username = ref("");
const email = ref("");
const password = ref("");

const auth = useAuthStore();
const router = useRouter();

async function handleSignup() {
  try {
    await auth.signup({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
    });
    router.push("/dashboard");
  } catch (err) {
    alert("Signup failed. Please check your input.");
  }
}
</script>
