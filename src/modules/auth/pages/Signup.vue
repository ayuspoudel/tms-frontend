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

        <label>Email</label>
        <input v-model="email" type="email" placeholder="ayushpoudel@gmail.com" required />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" required />

        <button type="submit" :disabled="loading">
          {{ loading ? "Creating account..." : "Sign Up" }}
        </button>
      </form>

      <!-- States -->
      <div v-if="successMessage" class="success-msg">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

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
import { useAuthStore } from "../../../store/auth.store";
import BrandHeader from "@/components/BrandHeader.vue";

// Form state
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");

// UI state
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const auth = useAuthStore();
const router = useRouter();

async function handleSignup() {
  successMessage.value = "";
  errorMessage.value = "";
  loading.value = true;

  try {
    const res = await auth.signup({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
    });

    successMessage.value = res.message || "Signup successful!";
    // Redirect after short delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  } catch (err) {
    errorMessage.value =
      err?.response?.data?.message || err.message || "Signup failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.success-msg {
  margin-top: 1rem;
  color: #065f46;
  background: #d1fae5;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

.error-msg {
  margin-top: 1rem;
  color: #991b1b;
  background: #fee2e2;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
