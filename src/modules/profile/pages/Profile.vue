<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="profile-header">
      <div class="avatar">
        {{ initials }}
      </div>
      <div class="profile-info">
        <h1>{{ firstName }} {{ lastName }}</h1>
        <p class="email">
          {{ email }}
          <span v-if="!user?.emailVerified" class="verify">
            <button @click="verifyEmail">Verify</button>
          </span>
          <span v-else class="verified">Verified</span>
        </p>
        <div class="badges">
          <span class="badge role">{{ user?.role }}</span>
          <span :class="['badge', user?.status?.toLowerCase()]">{{ user?.status }}</span>
        </div>
      </div>
    </div>

    <!-- Details -->
    <div class="profile-details">
      <div class="detail-item">
        <label>First Name</label>
        <input v-model="firstName" type="text" />
      </div>
      <div class="detail-item">
        <label>Last Name</label>
        <input v-model="lastName" type="text" />
      </div>
      <div class="detail-item">
        <label>Created At</label>
        <span>{{ formatDate(user?.createdAt) }}</span>
      </div>
      <div class="detail-item">
        <label>Last Login</label>
        <span>{{ formatDate(user?.lastLogin) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="profile-actions">
      <button class="action-btn" @click="updateProfile">Save Changes</button>
    </div>

    <!-- Change Password -->
    <div class="profile-section">
      <h2>Change Password</h2>
      <form @submit.prevent="updatePassword" class="password-form">
        <input v-model="currentPassword" type="password" placeholder="Current Password" required />
        <input v-model="newPassword" type="password" placeholder="New Password" required />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
        <button type="submit" class="action-btn">Update Password</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { profileApi } from "@/api/auth.api";

const user = ref(null);

const firstName = ref("");
const lastName = ref("");
const email = ref("");

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

onMounted(async () => {
  try {
    const { data } = await profileApi();
    user.value = data.user;
    firstName.value = data.user.firstName || "";
    lastName.value = data.user.lastName || "";
    email.value = data.user.email || "";
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
});

const initials = computed(() =>
  (firstName.value?.charAt(0) || "").toUpperCase() +
  (lastName.value?.charAt(0) || "").toUpperCase()
);

function updateProfile() {
  alert("Profile updated (mock)");
}

function updatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }
  alert("Password updated (mock)");
}

function verifyEmail() {
  alert("Verification email sent to " + email.value);
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped>
.profile-page {
  max-width: 700px;
  margin: 1.5rem auto;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  color: #111;
}

/* Header */
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #2f855a;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info h1 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.profile-info .email {
  font-size: 0.85rem;
  color: #374151;
  margin: 0.25rem 0;
}

.badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f3f4f6;
  color: #374151;
}
.badge.active {
  background: #d1fae5;
  color: #065f46;
}
.badge.suspended {
  background: #fee2e2;
  color: #991b1b;
}

/* Details */
.profile-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
  margin-bottom: 1rem;
}

.detail-item label {
  font-weight: 600;
  font-size: 0.8rem;
  color: #374151;
  margin-bottom: 0.2rem;
  display: block;
}
.detail-item input {
  width: 100%;
  padding: 0.35rem;
  font-size: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

/* Actions */
.profile-actions {
  margin-bottom: 1.5rem;
}

/* Password */
.profile-section h2 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.password-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.password-form input {
  padding: 0.35rem;
  font-size: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

/* Buttons */
.action-btn {
  background: #2f855a;
  color: #fff;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}
.action-btn:hover {
  background: #276749;
}

/* Verify */
.verify button {
  background: #facc15;
  border: none;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}
.verified {
  color: #16a34a;
  font-weight: 600;
}
</style>
