module.exports = {
  apps: [{
    name: 'darkroom-guide',
    script: 'npm',
    args: 'run start',
    cwd: '/opt/darkroom-guide',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: "/opt/darkroom-guide/logs/err.log",
    out_file: "/opt/darkroom-guide/logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true,
    log_type: "json",
    exp_backoff_restart_delay: 100,
    max_restarts: 10,
    kill_timeout: 5000,
    wait_ready: true
  }]
}