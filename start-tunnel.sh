#!/bin/bash

# Start Vite dev server in background if not already running
if ! lsof -ti:5173 > /dev/null 2>&1; then
  echo "Starting Vite dev server..."
  npm run dev > /dev/null 2>&1 &
  sleep 3
fi

# Start Cloudflare tunnel and capture the URL
echo "Starting Cloudflare tunnel..."
echo "Your public URL will appear below:"
echo ""

cloudflared tunnel --url http://localhost:5173

