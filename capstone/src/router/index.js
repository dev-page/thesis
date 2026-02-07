import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requirePermission } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/public/Home.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/public/Login.vue'),
      },
      {
        path: '/register', //For clients/patients
        name: 'register',
        component: () => import('@/views/public/Register.vue'),
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/public/ForgotPassword.vue'),
      },
      {
        path: '/clinic/register',
        name: 'register-clinic',
        component: () => import('@/views/public/RegisterClinic.vue'),
      },
      {
        path: '/centers',
        name: 'centers',
        component: () => import('@/views/public/ViewCenters.vue'),
      },
      {
        path: '/subscription',
        name: 'subscription',
        component: () => import('@/views/public/Subscription.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/clinic/practitioners/Dashboard.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/patients',
        name: 'patients',
        component: () => import('@/views/clinic/practitioners/Patients.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/appointments',
        name: 'appointments',
        component: () => import('@/views/clinic/practitioners/Appointments.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/crm/dashboard',
        name: 'crm-dashboard',
        component: () => import('@/views/admin/crm/CrmDashboard.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/hr/dashboard',
        name: 'hr-dashboard',
        component: () => import('@/views/admin/hr/HRDashboard.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/hr/employees',
        name: 'hr-employees',
        component: () => import('@/views/admin/hr/HREmployees.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/hr/sales',
        name: 'hr-sales',
        component: () => import('@/views/admin/hr/HRSales.vue'),
        beforeEnter: requireAuth,
      },

      {
        path: '/supply/dashboard',
        name: 'supply-dashboard',
        component: () => import('@/views/admin/supply/SupplyDashboard.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/supply/suppliers',
        name: 'supply-suppliers',
        component: () => import('@/views/admin/supply/SupplySuppliers.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/supply/catalog',
        name: 'supply-catalog',
        component: () => import('@/views/admin/supply/SupplyCatalog.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/supply/purchase-requests',
        name: 'supply-purchase-requests',
        component: () => import('@/views/admin/supply/SupplyPurchaseRequests.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/practitioner/dashboard',
        name: 'practitioner-dashboard',
        component: () => import('@/views/clinic/practitioners/PractitionerDashboard.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/owner/dashboard',
        name: 'owner-dashboard',
        component: () => import('@/views/admin/owner/OwnerDashboard.vue'),
        beforeEnter: requireAuth,
      },
      {
        path: '/owner/branch',
        name: 'owner-branch',
        component: () => import('@/views/admin/owner/OwnerBranch.vue'),
        beforeEnter: requireAuth,
      }
    ],
})  

export default router
