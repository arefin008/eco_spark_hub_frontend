export const apiEndpoints = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refreshToken: "/auth/refresh-token",
    me: "/auth/me",
    changePassword: "/auth/change-password",
    logout: "/auth/logout",
    verifyEmail: "/auth/verify-email",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  ideas: {
    list: "/ideas",
    mine: "/ideas/mine",
    byId: (id: string) => `/ideas/${id}`,
    create: "/ideas",
    update: (id: string) => `/ideas/${id}`,
    remove: (id: string) => `/ideas/${id}`,
    submit: (id: string) => `/ideas/${id}/submit`,
    review: (id: string) => `/ideas/${id}/review`,
  },
  categories: {
    list: "/categories",
    create: "/categories",
    update: (id: string) => `/categories/${id}`,
    remove: (id: string) => `/categories/${id}`,
  },
  comments: {
    listByIdea: (ideaId: string) => `/comments/idea/${ideaId}`,
    create: "/comments",
    remove: (id: string) => `/comments/${id}`,
  },
  votes: {
    upsert: "/votes",
    remove: "/votes",
  },
  newsletter: {
    subscribe: "/newsletter/subscribe",
    unsubscribe: (email: string) => `/newsletter/unsubscribe/${email}`,
    list: "/newsletter",
  },
  payments: {
    confirm: "/payments/confirm",
    stripeSuccess: "/payments/stripe/success",
    stripeCancel: "/payments/stripe/cancel",
    checkout: (purchaseId: string) => `/payments/${purchaseId}/checkout`,
    status: (purchaseId: string) => `/payments/${purchaseId}/status`,
    webhook: "/payments/webhook",
  },
  purchases: {
    create: "/purchases",
    mine: "/purchases/me",
  },
  users: {
    list: "/users",
    byId: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
  },
  admin: {
    stats: "/admin/stats",
    updateUserStatus: (id: string) => `/admin/users/${id}/status`,
  },
} as const;
