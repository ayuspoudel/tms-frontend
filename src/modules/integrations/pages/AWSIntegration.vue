<template>
  <div class="aws-page">
    <!-- Header -->
    <div class="page-header">
      <h1>AWS Integration</h1>
      <p class="subtitle">
        Connect your AWS account so this platform can provision and manage an
        <a href="https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html" target="_blank">Amazon EKS cluster</a>
        in your account using a secure IAM Role and CloudFormation stack.
      </p>
    </div>

    <!-- Connect Form -->
    <div class="card">
      <h2>Connect AWS Account</h2>
      <form @submit.prevent="connectAWS">
        <div class="form-row">
          <label>Account ID</label>
          <input v-model="form.accountId" type="text" required placeholder="123456789012" />
          <small class="helper">
            Your 12-digit AWS Account ID where the integration will be deployed.
            <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html" target="_blank">Find my Account ID</a>
          </small>
        </div>

        <div class="form-row">
          <label>Region</label>
          <input v-model="form.region" type="text" required placeholder="us-east-1" />
          <small class="helper">
            The AWS Region where resources will be created (e.g., <code>us-east-1</code>).
            <a href="https://docs.aws.amazon.com/general/latest/gr/rande.html" target="_blank">See all Regions</a>
          </small>
        </div>

        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? "Connecting..." : "Connect AWS" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Integrations List -->
    <div class="card" v-if="integrations.length">
      <h2>Existing Integrations</h2>
      <table class="aws-table">
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Region</th>
            <th>Status</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="integration in integrations" :key="integration.id">
            <td>{{ integration.config.accountId }}</td>
            <td>{{ integration.config.region }}</td>
            <td>
              <span :class="['status-tag', integration.status?.toLowerCase()]">
                {{ integration.status || "Unknown" }}
              </span>
            </td>
            <td class="actions">
              <button class="btn btn-small" @click="checkStatus(integration)">Check</button>
              <button class="btn btn-small" @click="launchBootstrap()">Launch Stack</button>
              <button class="btn btn-small btn-secondary" @click="viewTemplate">View Template</button>
              <button class="btn btn-small btn-danger" @click="deleteIntegration(integration)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Integrations -->
    <div v-else class="empty-state">
      <p>No AWS integrations found yet.</p>
    </div>

    <!-- Modal for stack status -->
    <div v-if="statusModal" class="modal-overlay" @click.self="statusModal = null">
      <div class="modal">
        <h3>Stack Status</h3>
        <p><strong>Stack:</strong> {{ stackStatus.stackName }}</p>
        <p><strong>Status:</strong> {{ stackStatus.status }}</p>
        <ul v-if="stackStatus.outputs.length">
          <li v-for="out in stackStatus.outputs" :key="out.OutputKey">
            <strong>{{ out.OutputKey }}:</strong> {{ out.OutputValue }}
          </li>
        </ul>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="statusModal = null">Close</button>
        </div>
      </div>
    </div>

    <!-- Modal for viewing template -->
    <div v-if="templateModal" class="modal-overlay" @click.self="templateModal = false">
      <div class="modal">
        <h3>CloudFormation Template</h3>
        <pre class="template-preview">{{ templateContent }}</pre>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="templateModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  connectAWSApi,
  listAWSApi,
  deleteAWSApi,
  getAWSBootstrapLinkApi,
  getAWSBootstrapStatusApi,
  getAWSBootstrapTemplateApi,
} from "@/api/aws.api";

const emit = defineEmits(["update-breadcrumb"]);

const tenantId = "default"; // single-tenant setup
const integrations = ref([]);
const loading = ref(false);
const statusModal = ref(false);
const templateModal = ref(false);
const templateContent = ref("");
const stackStatus = reactive({ stackName: "", status: "", outputs: [] });

const form = reactive({
  accountId: "",
  region: "us-east-1",
});

// default role name used for integration
const saasRoleName = "TaskManagerIntegrationRole";

async function loadIntegrations() {
  try {
    const { data } = await listAWSApi();
    integrations.value = data;
  } catch (err) {
    console.error("Failed to load AWS integrations", err);
  }
}

async function connectAWS() {
  loading.value = true;
  try {
    const roleArn = `arn:aws:iam::${form.accountId}:role/${saasRoleName}`;
    await connectAWSApi({ tenantId, accountId: form.accountId, region: form.region, roleArn });
    await loadIntegrations();
    form.accountId = "";
  } catch (err) {
    console.error("Failed to connect AWS", err);
  } finally {
    loading.value = false;
  }
}

async function checkStatus(integration) {
  try {
    const { data } = await getAWSBootstrapStatusApi(integration.id);
    stackStatus.stackName = data.stackName;
    stackStatus.status = data.status;
    stackStatus.outputs = data.outputs || [];
    statusModal.value = true;
  } catch (err) {
    console.error("Failed to fetch stack status", err);
  }
}

async function launchBootstrap() {
  try {
    const saasAccountId = "123456789012"; // SaaS AWS account ID
    const launchUrl = await getAWSBootstrapLinkApi(saasAccountId, saasRoleName);

    if (launchUrl) {
      window.open(launchUrl, "_blank");
    } else {
      alert("Failed to generate Launch Stack link");
    }
  } catch (err) {
    console.error("Failed to get bootstrap link", err);
  }
}


async function viewTemplate() {
  try {
    const { data } = await getAWSBootstrapTemplateApi();
    templateContent.value = data;
    templateModal.value = true;
  } catch (err) {
    console.error("Failed to fetch template", err);
  }
}

async function deleteIntegration(integration) {
  try {
    await deleteAWSApi(integration.id);
    await loadIntegrations();
  } catch (err) {
    console.error("Failed to delete AWS integration", err);
  }
}

onMounted(async () => {
  emit("update-breadcrumb", [
    { label: "Integrations", to: "/integrations" },
    { label: "AWS Integration" },
  ]);
  await loadIntegrations();
});
</script>

<style scoped>
/* ========== PAGE ========== */
.aws-page {
  padding: 2rem;
  font-family: 'Outfit', sans-serif;
  background: #f4f5f7;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #5e6c84;
  line-height: 1.5;
}

/* ========== CARD ========== */
.card {
  background: #fff;
  border: 1px solid #dfe1e6;
  border-radius: 4px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

.card h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

/* ========== FORM ========== */
.form-row {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-row label {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #172b4d;
}

input {
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  padding: 0.4rem 0.5rem;
  font-size: 0.9rem;
}

input:focus {
  outline: none;
  border-color: #4c9aff;
  box-shadow: 0 0 0 2px #deebff;
}

.helper {
  font-size: 0.75rem;
  color: #6b778c;
  margin-top: 0.25rem;
}

.actions {
  margin-top: 1rem;
}

/* ========== TABLE ========== */
.aws-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.aws-table th,
.aws-table td {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #ebecf0;
  text-align: left;
}

.aws-table th {
  background: #f4f5f7;
  font-weight: 500;
  color: #172b4d;
}

.status-tag {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}
.status-tag.pending { background: #fef3c7; color: #92400e; }
.status-tag.create_complete { background: #d1fae5; color: #065f46; }
.status-tag.failed { background: #fee2e2; color: #991b1b; }

/* ========== BUTTONS ========== */
.btn {
  padding: 0.35rem 0.7rem;
  border-radius: 3px;
  font-size: 0.8rem;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease;
}

.btn-primary {
  background: #0052cc;
  color: #fff;
}

.btn-primary:hover {
  background: #0747a6;
}

.btn-secondary {
  background: #f4f5f7;
  color: #172b4d;
}

.btn-danger {
  background: #de350b;
  color: #fff;
}

.btn-danger:hover {
  background: #bf2600;
}

.btn-small {
  font-size: 0.75rem;
  margin-right: 0.3rem;
  background: #f4f5f7;
  color: #172b4d;
}

.btn-small:hover {
  background: #ebecf0;
}

/* ========== EMPTY STATE ========== */
.empty-state {
  text-align: center;
  color: #6b778c;
  padding: 2rem;
  font-size: 0.9rem;
}

/* ========== MODALS ========== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 30, 66, 0.54);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: #fff;
  border-radius: 3px;
  padding: 1.25rem;
  width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(9, 30, 66, 0.25);
}

.modal h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #172b4d;
}

.modal-actions {
  margin-top: 1rem;
  text-align: right;
}

.template-preview {
  background: #f4f5f7;
  padding: 0.75rem;
  border-radius: 3px;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 0.8rem;
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
