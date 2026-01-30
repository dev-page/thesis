# Clinic Management System Architecture

## Overview
This document outlines the complete architecture for a clinic management system built on Vue.js 3 with Firebase. The system includes subscription-based plans, role-based access control, feature gating, and backend services via Cloud Functions.

## Current Tech Stack
- **Frontend**: Vue 3 with Composition API, Vue Router, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Deployment**: Firebase Hosting
- **Authentication**: Firebase Auth
- **Database**: Firestore (NoSQL)
- **File Storage**: Firebase Storage

## Subscription Plans

### Basic Plan
- **Price**: Free / $9.99/month
- **Features**:
  - 1 clinic location
  - Up to 5 staff members
  - Patient management (CRUD)
  - Appointment scheduling
  - Basic reports
- **Limitations**: No billing module, limited storage

### Pro Plan
- **Price**: $29.99/month
- **Features**:
  - Up to 3 clinic locations
  - Up to 20 staff members
  - All Basic features
  - Billing and invoicing
  - Advanced reports
  - Email notifications
- **Limitations**: No API access, limited integrations

### Enterprise Plan
- **Price**: $99.99/month
- **Features**:
  - Unlimited clinic locations
  - Unlimited staff members
  - All Pro features
  - API access for integrations
  - Custom workflows
  - Priority support
- **Limitations**: None

## Staff Roles and Capabilities

### Roles Hierarchy
1. **Owner**: Full system access, manage subscriptions
2. **Admin**: Manage staff, clinic settings, full data access
3. **Doctor**: Patient care, medical records, prescriptions
4. **Nurse**: Assist doctors, update patient vitals
5. **Receptionist**: Appointment scheduling, patient check-in
6. **Accountant**: Billing, financial reports

### Capabilities Matrix

| Capability | Owner | Admin | Doctor | Nurse | Receptionist | Accountant |
|------------|-------|-------|--------|-------|--------------|------------|
| manage_clinic | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| manage_staff | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| view_patients | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| edit_patients | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| manage_appointments | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| prescribe_medication | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| access_billing | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ |
| view_reports | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| manage_subscription | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

## Firestore Data Model

### Collections Structure

```
firestore
├── clinics/
│   ├── {clinicId}/
│   │   ├── info: Clinic document
│   │   ├── staff: Subcollection of user references
│   │   └── patients: Subcollection
├── users/
│   ├── {userId}/
│   │   ├── profile: User document
│   │   └── clinics: Subcollection of clinic memberships
├── subscriptions/
│   ├── {subscriptionId}/
│   │   ├── details: Subscription document
│   │   └── payments: Subcollection
├── patients/
│   ├── {patientId}/
│   │   ├── info: Patient document
│   │   └── records: Subcollection (medical history)
├── appointments/
│   └── {appointmentId}/
└── invoices/
    └── {invoiceId}/
```

### Key Document Structures

#### Clinic Document
```json
{
  "id": "clinic123",
  "name": "Downtown Clinic",
  "address": "...",
  "phone": "...",
  "subscriptionId": "sub456",
  "createdAt": "2024-01-01T00:00:00Z",
  "settings": {
    "timezone": "America/New_York",
    "currency": "USD"
  }
}
```

#### User Document
```json
{
  "id": "user123",
  "email": "doctor@clinic.com",
  "displayName": "Dr. Smith",
  "role": "doctor",
  "clinicId": "clinic123",
  "createdAt": "2024-01-01T00:00:00Z",
  "permissions": ["view_patients", "edit_patients", "manage_appointments"]
}
```

#### Subscription Document
```json
{
  "id": "sub456",
  "clinicId": "clinic123",
  "plan": "pro",
  "status": "active",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-02-01T00:00:00Z",
  "features": ["billing", "reports", "notifications"]
}
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function hasClinicAccess(clinicId) {
      return isAuthenticated() &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)/clinics/$(clinicId));
    }

    function getUserRole(clinicId) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)/clinics/$(clinicId)).data.role;
    }

    function hasPermission(permission) {
      return isAuthenticated() &&
             permission in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions;
    }

    // Clinics collection
    match /clinics/{clinicId} {
      allow read: if hasClinicAccess(clinicId);
      allow write: if hasPermission('manage_clinic') && hasClinicAccess(clinicId);
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || hasClinicAccess(resource.data.clinicId);
      allow write: if isOwner(userId) || (hasPermission('manage_staff') && hasClinicAccess(resource.data.clinicId));
    }

    // Patients collection
    match /patients/{patientId} {
      allow read: if hasPermission('view_patients') && hasClinicAccess(resource.data.clinicId);
      allow write: if hasPermission('edit_patients') && hasClinicAccess(resource.data.clinicId);
    }

    // Appointments collection
    match /appointments/{appointmentId} {
      allow read, write: if hasPermission('manage_appointments') && hasClinicAccess(resource.data.clinicId);
    }

    // Invoices collection (Pro+ plans only)
    match /invoices/{invoiceId} {
      allow read, write: if hasPermission('access_billing') && hasClinicAccess(resource.data.clinicId) &&
                           'billing' in get(/databases/$(database)/documents/subscriptions/$(resource.data.subscriptionId)).data.features;
    }

    // Subscriptions collection
    match /subscriptions/{subscriptionId} {
      allow read: if hasClinicAccess(resource.data.clinicId);
      allow write: if hasPermission('manage_subscription') && hasClinicAccess(resource.data.clinicId);
    }
  }
}
```

## Vue.js Access Control and Feature Gating

### Composables

#### usePermissions.js
```javascript
import { computed } from 'vue'
import { useAuth } from './useAuth'

export function usePermissions() {
  const { user } = useAuth()

  const userPermissions = computed(() => {
    // Fetch from Firestore or store in user metadata
    return user.value?.permissions || []
  })

  const hasPermission = (permission) => {
    return userPermissions.value.includes(permission)
  }

  const userRole = computed(() => user.value?.role || 'guest')

  return {
    userPermissions,
    hasPermission,
    userRole
  }
}
```

#### useSubscription.js
```javascript
import { computed } from 'vue'
import { useAuth } from './useAuth'

export function useSubscription() {
  const { user } = useAuth()

  const currentPlan = computed(() => {
    // Fetch subscription details
    return user.value?.clinic?.subscription?.plan || 'basic'
  })

  const hasFeature = (feature) => {
    const planFeatures = {
      basic: ['patients', 'appointments', 'basic_reports'],
      pro: ['patients', 'appointments', 'reports', 'billing', 'notifications'],
      enterprise: ['patients', 'appointments', 'reports', 'billing', 'notifications', 'api', 'custom_workflows']
    }
    return planFeatures[currentPlan.value]?.includes(feature) || false
  }

  return {
    currentPlan,
    hasFeature
  }
}
```

### Vue Components Usage

```vue
<template>
  <div>
    <button v-if="hasPermission('manage_staff')" @click="addStaff">
      Add Staff
    </button>
    
    <billing-section v-if="hasFeature('billing')" />
    
    <api-settings v-if="hasFeature('api')" />
  </div>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions'
import { useSubscription } from '@/composables/useSubscription'

const { hasPermission } = usePermissions()
const { hasFeature } = useSubscription()
</script>
```

### Route Guards

```javascript
// router/index.js
import { useAuth } from '@/composables/useAuth'
import { usePermissions } from '@/composables/usePermissions'

const { user } = useAuth()
const { hasPermission } = usePermissions()

const routes = [
  {
    path: '/admin',
    component: AdminDashboard,
    beforeEnter: (to, from) => {
      if (!user.value || !hasPermission('manage_clinic')) {
        return '/unauthorized'
      }
    }
  }
]
```

## Cloud Functions

### Key Functions

#### createClinic
- Creates new clinic document
- Sets up initial subscription
- Sends welcome email

#### addStaffMember
- Validates permissions
- Creates user account
- Sends invitation email

#### processPayment
- Handles Stripe webhooks
- Updates subscription status
- Sends confirmation emails

#### generateReport
- Aggregates data from Firestore
- Generates PDF reports
- Stores in Firebase Storage

### Function Structure

```javascript
// functions/src/index.js
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export const createClinic = functions.https.onCall(async (data, context) => {
  // Validate authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated')
  }

  // Create clinic document
  const clinicRef = admin.firestore().collection('clinics').doc()
  await clinicRef.set({
    name: data.name,
    ownerId: context.auth.uid,
    // ... other fields
  })

  // Create subscription
  const subscriptionRef = admin.firestore().collection('subscriptions').doc()
  await subscriptionRef.set({
    clinicId: clinicRef.id,
    plan: 'basic',
    // ... subscription details
  })

  return { clinicId: clinicRef.id }
})
```

## Project Structure Expansion

```
capstone/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.vue
│   │   │   ├── Modal.vue
│   │   │   └── Table.vue
│   │   ├── clinic/
│   │   │   ├── PatientForm.vue
│   │   │   ├── AppointmentCalendar.vue
│   │   │   └── BillingInvoice.vue
│   │   └── admin/
│   │       ├── StaffManagement.vue
│   │       └── SubscriptionSettings.vue
│   ├── composables/
│   │   ├── useAuth.js
│   │   ├── usePermissions.js
│   │   ├── useSubscription.js
│   │   └── useFirestore.js
│   ├── views/
│   │   ├── public/
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── Platform.vue
│   │   ├── clinic/
│   │   │   ├── Dashboard.vue
│   │   │   ├── Patients.vue
│   │   │   ├── Appointments.vue
│   │   │   ├── Billing.vue
│   │   │   └── Reports.vue
│   │   └── admin/
│   │       ├── ClinicSettings.vue
│   │       ├── Staff.vue
│   │       └── Subscription.vue
│   ├── router/
│   │   ├── guards.js
│   │   └── index.js
│   ├── stores/
│   │   ├── clinic.js
│   │   └── user.js
│   └── utils/
│       ├── permissions.js
│       └── validation.js
├── functions/
│   ├── src/
│   │   ├── index.js
│   │   └── services/
│   │       ├── clinicService.js
│   │       └── subscriptionService.js
│   └── package.json
└── firestore.rules
```

## Implementation Roadmap

1. **Phase 1**: Core authentication and clinic setup
2. **Phase 2**: Patient management and appointments
3. **Phase 3**: Billing and reporting (Pro features)
4. **Phase 4**: Advanced features and API (Enterprise)
5. **Phase 5**: Testing, optimization, and deployment

## Security Considerations

- All data encrypted at rest and in transit
- Row-level security via Firestore rules
- JWT tokens for API access (Enterprise)
- Regular security audits
- GDPR compliance for patient data

## Scalability

- Firestore auto-scaling
- Cloud Functions horizontal scaling
- CDN for static assets
- Database indexing for performance
- Caching strategies for frequently accessed data

This architecture provides a solid foundation for a scalable, secure clinic management system with flexible subscription tiers and comprehensive access control.