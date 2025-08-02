# 🚀 Quick Start Guide

## 3 Simple Steps to Run the App

### Step 1: Get Meta API Credentials (5 minutes)
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add **Facebook Login** product
4. Copy your **App ID** and **App Secret**

### Step 2: Configure Environment
```bash
# Edit the .env file that was created
nano .env

# Add your Meta credentials:
META_APP_ID=your-app-id-here
META_APP_SECRET=your-app-secret-here
```

### Step 3: Run with Docker
```bash
# Make sure Docker is running, then:
./start.sh
```

That's it! The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000  
- **Database Admin**: http://localhost:8080

## Alternative: Run Without Docker

If you prefer not to use Docker:

```bash
# Install dependencies
npm install

# Start backend (terminal 1)
cd backend && npm run dev

# Start frontend (terminal 2)  
cd frontend && npm run dev
```

## Troubleshooting

**Docker not working?**
- Make sure Docker Desktop is running
- Try: `docker system prune` to clean up

**Can't access Meta APIs?**
- Check your App ID and Secret in `.env`
- Make sure your Facebook App has the right permissions

**Port already in use?**
- Stop other services on ports 3000, 8000, 5432, 6379
- Or change ports in `docker-compose.dev.yml`

## What You'll See

1. **Dashboard** - Overview of competitor activities
2. **Add Competitor** - Add Facebook pages or Instagram accounts to monitor
3. **Reports** - Generate and download analytics reports

The app comes with sample data so you can explore the interface immediately!