module.exports = {
  apps: [
    {
      name: 'jinsang-api',
      script: './index.js',
      instances: 'max', // CPU 코어 수만큼 프로세스 생성
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000, 
      }
    }
  ]
};
