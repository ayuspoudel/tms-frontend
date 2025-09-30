<template>
  <div class="integrations-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Integrations</h1>
      <p class="subtitle">
        Connect your AWS account and GitHub to unlock secure infrastructure management and
        seamless CI/CD pipelines. Below you’ll find detailed explanations of why these integrations
        are needed, what they enable, and answers to common questions.
      </p>
    </div>

    <!-- Grid -->
    <div class="grid">
      <!-- AWS Integration -->
      <div class="card">
        <img src="@/assets/logo/aws-logo.png" alt="AWS Logo" class="logo" />
        <h2>AWS Account Bootstrap</h2>
        <p>
          The AWS integration launches a guided
          <a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html" target="_blank">CloudFormation stack</a>
          that creates a dedicated
          <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html" target="_blank">IAM role</a>
          with tightly scoped permissions. This avoids permanent keys and follows AWS security best practices.
        </p>
        <p>
          With this role, the platform provisions and manages an
          <a href="https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html" target="_blank">Amazon EKS cluster</a>
          inside your account. You own the cluster and resources, while we use temporary STS credentials to operate
          within the scope you approve.
        </p>
        <p>Make sure the resource on which TMS is deployed has <strong>aws:sts:assume-role</strong></p>

        <!-- CTA -->
        <div class="cta">
          <button v-if="awsSetup" class="btn success" disabled>
            ✓ AWS Integration Active
          </button>
          <router-link v-else to="/integrations/aws" class="btn primary">
            Setup AWS Integration
          </router-link>
        </div>

        <!-- AWS FAQ -->
        <div class="faq">
          <h3>Common Questions</h3>
          <div class="faq-item" v-for="(faq, i) in awsFaqs" :key="i">
            <button class="faq-question" @click="toggleFaq('aws', i)">
              <span>{{ faq.q }}</span>
              <svg
                :class="{ open: faq.open }"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path fill="none" stroke="currentColor" stroke-width="2" d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div v-if="faq.open" class="faq-answer">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- GitHub Integration -->
      <div class="card">
        <img src="@/assets/logo/github-logo.png" alt="GitHub Logo" class="logo" />
        <h2>GitHub Integration</h2>
        <p>
          Installing our service as a
          <a href="https://docs.github.com/en/apps/creating-github-apps" target="_blank">GitHub App</a>
          allows pipelines to run on <strong>self-hosted runners</strong> inside your AWS EKS cluster,
          instead of GitHub’s hosted runners.
        </p>
        <p>
          This can significantly reduce CI/CD costs and improve scalability. For example,
          <a href="https://github.blog/2022-07-07-github-actions-self-hosted-runners-on-kubernetes/" target="_blank">GitHub Engineering</a>
          and
          <a href="https://blog.rockset.com/self-hosted-github-actions-runners-in-kubernetes/" target="_blank">Rockset</a>
          both documented savings by running Actions in Kubernetes.
        </p>

        <!-- CTA -->
        <div class="cta">
          <button v-if="githubSetup" class="btn success" disabled>
            ✓ GitHub Integration Active
          </button>
          <router-link v-else to="/integrations/github" class="btn primary">
            Setup GitHub Integration
          </router-link>
        </div>

        <!-- GitHub FAQ -->
        <div class="faq">
          <h3>Common Questions</h3>
          <div class="faq-item" v-for="(faq, i) in githubFaqs" :key="i">
            <button class="faq-question" @click="toggleFaq('github', i)">
              <span>{{ faq.q }}</span>
              <svg
                :class="{ open: faq.open }"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path fill="none" stroke="currentColor" stroke-width="2" d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div v-if="faq.open" class="faq-answer">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { listAWSApi } from "@/api/aws.api"; // your API

const awsSetup = ref(false);
const githubSetup = ref(false); // placeholder until GitHub API is wired

const awsFaqs = reactive([
  {
    q: "Why do I need to create an IAM Role?",
    a: "The IAM Role defines what the platform can do in your account. We assume this role temporarily using STS instead of storing permanent access keys.",
    open: false,
  },
  {
    q: "What services will be created in my account?",
    a: "Primarily an EKS cluster and supporting IAM resources. You may also see node groups, load balancers, and namespaces depending on usage.",
    open: false,
  },
  {
    q: "Can I revoke access later?",
    a: "Yes. Simply delete or update the IAM Role trust relationship in your AWS Console to remove access immediately.",
    open: false,
  },
]);

const githubFaqs = reactive([
  {
    q: "Do I need GitHub integration for cron jobs?",
    a: "No. If you only run scheduled jobs (like nightly reports), GitHub integration is optional.",
    open: false,
  },
  {
    q: "How much money can I save?",
    a: "Organizations like GitHub and Rockset reported significant cost reductions by moving from hosted runners to Kubernetes-based self-hosted runners.",
    open: false,
  },
  {
    q: "Can I uninstall the GitHub App?",
    a: "Yes. You can revoke access at any time from your GitHub organization settings.",
    open: false,
  },
]);

function toggleFaq(section, index) {
  if (section === "aws") awsFaqs[index].open = !awsFaqs[index].open;
  else githubFaqs[index].open = !githubFaqs[index].open;
}

const emit = defineEmits(["update-breadcrumb"]);
onMounted(async () => {
  try {
    const { data } = await listAWSApi("default");
    awsSetup.value = data && data.length > 0;
  } catch (err) {
    console.error("Failed to fetch AWS integrations", err);
  }
    emit("update-breadcrumb", [
    { label: "Integrations", to: "/integrations" },
    { label: "Overview" },
  ]);

  // GitHub check to be added later
});



</script>

<style scoped>
.integrations-page {
  padding: 1rem 2rem;
  font-family: 'Outfit', sans-serif;
}
.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.subtitle {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}
.logo {
  width: 70px;
  margin-bottom: 1rem;
}
h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.cta {
  margin: 1rem 0;
}
.btn.primary {
  background: #2563eb;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
}
.btn.primary:hover {
  background: #1e40af;
}
.btn.success {
  background: #16a34a;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
}
.faq {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}
.faq h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.faq-item {
  border-bottom: 1px solid #f3f4f6;
  padding: 0.5rem 0;
}
.faq-question {
  width: 100%;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0;
}
.faq-question svg {
  transition: transform 0.2s ease;
}
.faq-question svg.open {
  transform: rotate(180deg);
}
.faq-answer {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.5;
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

