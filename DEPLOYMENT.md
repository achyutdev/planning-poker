# 🚀 Deployment Guide

## Quick Deploy to Render (Free - Recommended)

### Step 1: Prepare GitHub Repository
```bash
cd /Users/adevkot/workspaces/git/planning-poker
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com and sign up (use GitHub OAuth)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and select your repository: `achyutdev/planning-poker`
4. Render will auto-detect the `render.yaml` configuration
5. Click **"Create Web Service"**

**That's it!** Your app will be deployed in ~2 minutes.

### Your App URL
`https://planning-poker-xxxx.onrender.com` (Render will provide the exact URL)

---

## Alternative: Deploy to Railway

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Railway
1. Go to https://railway.app and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Node.js and deploys
5. Click on your service → **"Settings"** → **"Generate Domain"**

**URL**: `https://planning-poker.up.railway.app`

---

## Configuration Files Included

✅ **render.yaml** - Render deployment config
✅ **Procfile** - Heroku/Railway compatibility
✅ **.env.example** - Environment variables template
✅ **package.json** - Updated with engines
✅ **server.js** - Production-ready with PORT binding

---

## Post-Deployment

### Test Your Deployment
1. Visit your deployed URL
2. Create a new session
3. Share the link with teammates
4. Test voting functionality

### Monitor Your App
- **Render**: Dashboard shows logs, metrics, and deployments
- **Railway**: Real-time logs and resource usage
- **Free tier limitations**: App may sleep after 15 mins of inactivity

### Custom Domain (Optional)
Both Render and Railway support custom domains on free tier:
1. Go to Settings → Custom Domain
2. Add your domain (e.g., `poker.yourdomain.com`)
3. Update DNS records as instructed

---

## Troubleshooting

### WebSocket Connection Issues
- Ensure your hosting platform supports WebSocket connections
- Render and Railway both support WebSockets on free tier

### App Sleeping
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid tier for always-on hosting

### Environment Issues
- Check logs: Render Dashboard → Logs tab
- Verify PORT is set correctly: Should use `process.env.PORT`

---

## Cost Comparison

| Platform | Free Tier | Always On | WebSocket | Best For |
|----------|-----------|-----------|-----------|----------|
| **Render** | 750 hrs/month | ❌ (sleeps) | ✅ | Quick deploy |
| **Railway** | $5 credit/month | ✅ (if credit lasts) | ✅ | Active projects |
| **Fly.io** | 3 VMs, 160GB | ✅ | ✅ | Production apps |

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Render/Railway
3. ✅ Test the application
4. ✅ Share with your team
5. 🎉 Start planning!

**Need help?** Check the logs on your hosting platform's dashboard.
