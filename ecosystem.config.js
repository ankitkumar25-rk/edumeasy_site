module.exports = {
  apps: [
    {
      name: 'edumeeasy-server',
      script: 'server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      merge_logs: true,
      autorestart: true,
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        DATABASE_URL: '',
        PASETO_LOCAL_KEY: '',
        PASETO_REFRESH_KEY: '',
        VALKEY_URL: '',
        CLOUDINARY_CLOUD_NAME: '',
        CLOUDINARY_API_KEY: '',
        CLOUDINARY_API_SECRET: '',
        RAZORPAY_KEY_ID: '',
        RAZORPAY_KEY_SECRET: '',
        RAZORPAY_WEBHOOK_SECRET: '',
        CLIENT_URL: '',
        RESEND_API_KEY: '',
        CONTACT_EMAIL: ''
      }
    }
  ]
};
