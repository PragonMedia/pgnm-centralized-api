# 🚀 **Complete Step-by-Step Guide: Upload API to DigitalOcean Server**

## **Phase 1: Prepare Your Local Code**

### **Step 1: Commit and push your local changes**

```bash
# On your Windows machine
git add .
git commit -m "Final working API with all features"
git push origin main
```

---

## **Phase 2: Deploy to DigitalOcean Server**

### **Step 2: SSH into your droplet**

```bash
ssh root@147.182.139.107
```

### **Step 3: Navigate to your project directory**

```bash
cd ~/backend-api/pgnm-centralized-api
```

### **Step 4: Pull the latest code from GitHub**

```bash
# Add Node.js to PATH
export PATH="/root/.nvm/versions/node/v18.20.8/bin:$PATH"

# Pull latest changes
git pull origin main
```

### **Step 5: Install/update dependencies**

```bash
# Install dependencies
npm install
```

### **Step 6: Kill any existing processes**

```bash
# Kill any existing Node.js processes
pkill -f node

# Verify port 3000 is free
ss -tlnp | grep 3000
```

### **Step 7: Start your API**

```bash
# Start the API
node server.js &
```

### **Step 8: Verify it's running**

```bash
# Check if it's running
ps aux | grep "server.js"

# Test locally
curl http://localhost:3000/health

# Test through Nginx
curl -k https://147.182.139.107/health
```

---

## **Phase 3: Set Up PM2 for Production (Optional but Recommended)**

### **Step 9: Install PM2 globally**

```bash
# Install PM2
npm install -g pm2

# Add to PATH
export PATH="/root/.nvm/versions/node/v18.20.8/bin:$PATH"
```

### **Step 10: Start with PM2**

```bash
# Stop the current process
pkill -f node

# Start with PM2
pm2 start server.js --name pgnm-api

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### **Step 11: Verify PM2 is managing your API**

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs pgnm-api
```

---

## **Phase 4: Test Your API Endpoints**

### **Step 12: Test all endpoints**

```bash
# Test health endpoint
curl -k https://147.182.139.107/health

# Test add domain endpoint
curl -k -X POST https://147.182.139.107/api/domains \
  -H "Content-Type: application/json" \
  -d '{"domain": "test-domain.com", "campaignID": "test123"}'

# Test main API endpoint
curl -k -X POST https://147.182.139.107/api/domains/test \
  -H "Content-Type: application/json" \
  -d '{"domain": "hello-world.com"}'
```

---

## **Phase 5: Future Development Workflow**

### **For future updates:**

**1. Make changes locally on Windows**

```bash
# Edit your code
# Test locally with npm run dev
```

**2. Push to GitHub**

```bash
git add .
git commit -m "Your update message"
git push origin main
```

**3. Deploy to server**

```bash
# SSH into server
ssh root@147.182.139.107

# Navigate to project
cd ~/backend-api/pgnm-centralized-api

# Add Node.js to PATH
export PATH="/root/.nvm/versions/node/v18.20.8/bin:$PATH"

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Restart API
pm2 restart pgnm-api

# Or if not using PM2
pkill -f node
node server.js &
```

---

## **📋 Quick Reference Commands**

### **Check if API is running:**

```bash
ps aux | grep "server.js"
ss -tlnp | grep 3000
```

### **Kill API process:**

```bash
pkill -f node
```

### **Start API:**

```bash
node server.js &
# OR
pm2 start server.js --name pgnm-api
```

### **Test API:**

```bash
curl -k https://147.182.139.107/health
```

---

## **🔧 Troubleshooting Common Issues**

### **Port 3000 already in use:**

```bash
# Find what's using port 3000
ss -tlnp | grep 3000

# Kill the process
kill -9 [PID_NUMBER]

# Or kill all node processes
pkill -f node
```

### **Node.js not found:**

```bash
# Add Node.js to PATH
export PATH="/root/.nvm/versions/node/v18.20.8/bin:$PATH"

# Verify it's working
which node
node --version
```

### **Dependencies missing:**

```bash
# Install dependencies
npm install

# If sqlite3 issues, reinstall
rm -rf node_modules package-lock.json
npm install
```

### **PM2 not found:**

```bash
# Install PM2 globally
npm install -g pm2

# Add to PATH
export PATH="/root/.nvm/versions/node/v18.20.8/bin:$PATH"
```

---

## **📊 API Endpoints Reference**

### **Health Check**

- **GET** `https://147.182.139.107/health`
- **Response:** `{"status": "OK", "message": "API is running"}`

### **Add Domain & Campaign ID**

- **POST** `https://147.182.139.107/api/domains`
- **Body:** `{"domain": "example.com", "campaignID": "your-id"}`
- **Response:** `{"success": true, "data": {"id": 36, "domain": "example.com", "campaignID": "your-id"}}`

### **Get RedTrack ID & Spy Detection**

- **POST** `https://147.182.139.107/api/domains/test`
- **Body:** `{"domain": "example.com"}`
- **Response:** `{"success": true, "data": {"domain": "example.com", "rtkcid": "redtrack-id", "past": true/false}}`

### **List All Domains**

- **GET** `https://147.182.139.107/api/domains`
- **Response:** Array of all stored domains

---

## **🎉 You're Done!**

**Your API is now deployed and ready for production use. Follow the "Future Development Workflow" for any updates.**

---

## **📝 Notes**

- **Server IP:** `147.182.139.107`
- **Project Path:** `~/backend-api/pgnm-centralized-api`
- **Node.js Version:** `v18.20.8`
- **Database:** SQLite (`database/domains.db`)
- **HTTPS:** Self-signed certificate (use `-k` flag with curl)
- **PM2 Process Name:** `pgnm-api`

---

## **🔄 Quick Deploy Script**

Save this as `deploy.sh` on your server for quick deployments:

```bash
#!/bin/bash
cd ~/backend-api/pgnm-centralized-api
export PATH="/root/.nvm/versions/node/v18.20.8/bin:$PATH"
git pull origin main
npm install
pkill -f node
node server.js &
echo "API deployed successfully!"
```

