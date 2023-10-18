#!/bin/bash
cd /mnt
echo $RUN_ENV

tee ./process.json <<-EOF
{
  "apps" : [{
    "script"    : "dist/server/server.bundle.js",
    "instances" : "max" ,
    "exec_mode" : "cluster",
    "env": {
      "NODE_ENV": "production",
      "SOA_NODE_PORT": ${NODE_PORT},
      "SOA_NODE_ENV": "${RUN_ENV}"
    }
  }]
}
EOF
tee ./tingyun.json <<-EOF
{
  "agent_log_level": "info",
  "app_name": "${RUN_ENV}-Sephora-node-web-mobile",
  "license_key": "Nh4he6givtKZDM48",
  "collectors": "10.71.78.40:7665",
  "ssl": false,
  "network_proxy.host": "",
  "network_proxy.port": "",
  "network_proxy.user": "",
  "network_proxy.password": "",
  "audit_mode": false
}
EOF

pm2 dump && pm2 start process.json --no-daemon

