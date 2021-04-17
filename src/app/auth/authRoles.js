export const authRoles = {
    admin: ['admin',], // Only SA & Admin has access
    therapist: ['admin', 'therapist'], // Only SA & Admin & Editor has access
    user: ['admin', 'therapist', 'user'], // Everyone has access
}

// Check out app/views/dashboard/DashboardRoutes.js
// Only SA & Admin has dashboard access

// const dashboardRoutes = [
//   {
//     path: "/dashboard/analytics",
//     component: Analytics,
//     auth: authRoles.admin <===============
//   }
// ];

// Check navigaitons.js

// {
//   name: "Dashboard",
//   path: "/dashboard/analytics",
//   icon: "dashboard",
//   auth: authRoles.admin <=================
// }
