export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  TEAM: '/team',
  GALLERY: '/gallery',
  MATHLABS: '/mathlabs',
  MATHKITS: '/mathkits',
  EVENTS: '/events',
  ENQUIRIES: '/enquiries',
  ORDERS: {
    CREATE: '/orders',
    VERIFY: '/orders/verify',
    GET_BY_ID: (id) => `/orders/${id}`,
  },
};
