<template>
  <nav class="breadcrumb-bar">
    <ul class="breadcrumb-list">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="['crumb', { active: index === items.length - 1 }]"
      >
        <router-link v-if="item.to && index !== items.length - 1" :to="item.to">
          {{ item.label }}
        </router-link>
        <span v-else>{{ item.label }}</span>

        <span v-if="index !== items.length - 1" class="separator">›</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true, // [{ label: "User Management", to: "/users" }, { label: "All Users" }]
  },
});
</script>

<style scoped>
.breadcrumb-bar {
  padding: 0.75rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-family: 'Outfit', sans-serif;
}
.breadcrumb-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}
.crumb {
  color: #374151;
}
.crumb.active {
  font-weight: 600;
  color: #111;
}
.separator {
  margin: 0 0.5rem;
  color: #9ca3af;
}
</style>
