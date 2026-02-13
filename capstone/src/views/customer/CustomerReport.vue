<script>
import CustomerSidebar from '@/components/sidebar/CustomerSidebar.vue';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

export default {
  name: 'ReportIssue',
  components: { CustomerSidebar },
  setup() {
    const issue = ref({
      title: '',
      category: '',
      description: '',
      screenshot: null,
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          issue.value.screenshot = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const submitIssue = () => {
      if (!issue.value.title || !issue.value.description) {
        toast.error('Please fill in all required fields.', {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      console.log('Issue submitted:', issue.value);
      toast.success('Your issue has been reported successfully!', {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });

      issue.value = { title: '', category: '', description: '', screenshot: null };
    };

    return { issue, handleFileUpload, submitIssue };
  },
};
</script>

<template>
  <div class="flex bg-slate-900 min-h-screen">
    <CustomerSidebar />

    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h1 class="text-3xl font-bold text-white mb-2 text-center">Report an Issue</h1>
        <p class="text-slate-400 text-center mb-6">Tell us what went wrong</p>

        <form @submit.prevent="submitIssue" class="space-y-6">
          <div>
            <label class="block text-slate-400 text-sm mb-2">Issue Title *</label>
            <input
              v-model="issue.title"
              type="text"
              placeholder="Brief issue title"
              class="w-full rounded-lg p-3 bg-slate-700 border border-slate-600 text-white 
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-slate-400 text-sm mb-2">Category</label>
            <select
              v-model="issue.category"
              class="w-full rounded-lg p-3 bg-slate-700 border border-slate-600 text-white 
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select category</option>
              <option value="bug">Bug</option>
              <option value="performance">Performance</option>
              <option value="ui">UI/UX</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-400 text-sm mb-2">Description *</label>
            <textarea
              v-model="issue.description"
              rows="5"
              placeholder="Describe the issue in detail"
              class="w-full rounded-lg p-3 bg-slate-700 border border-slate-600 text-white 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-slate-400 text-sm mb-2">Screenshot (optional)</label>
            <input type="file" @change="handleFileUpload" class="text-slate-400" />
            <div v-if="issue.screenshot" class="mt-3">
              <img :src="issue.screenshot" alt="Screenshot Preview" class="rounded-lg border border-slate-600 max-h-48" />
            </div>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-gold-700 hover:bg-gold-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Submit Issue
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
input[type="file"]::file-selector-button {
  display: none;
}
</style>