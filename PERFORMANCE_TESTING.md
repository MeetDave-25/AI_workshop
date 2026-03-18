# Performance & Stress Testing Guide

## Overview
This guide helps you test if your website can handle 100-150 concurrent users smoothly on both mobile and desktop.

## Prerequisites

### Option 1: Using k6 (Recommended - Easy Setup)

**Install k6:**
```bash
# Windows - using Chocolatey
choco install k6

# Windows - using Scoop
scoop install k6

# Or download from: https://github.com/grafana/k6/releases
```

**Run the load test:**
```bash
# Test against local server (default: localhost:5173)
k6 run performance-test.js

# Test against production (replace with your Vercel URL)
k6 run --env URL=https://your-deployment.vercel.app performance-test.js
```

### Option 2: Using Locust (Alternative - Python-based)

**Install Locust:**
```bash
pip install locust
```

**Run Locust:**
```bash
locust -f locustfile.py --host=http://localhost:5173 -u 150 -r 10 --run-time 10m
```

## What Gets Tested

✅ **Frontend Performance:**
- Page load time (should be < 3s)
- Image loading (team avatars, etc.)
- Chat component responsiveness
- Navigation smoothness
- Mobile viewport handling

✅ **Backend Performance:**
- API response times (target: < 500ms for 95th percentile)
- Server stability under load
- Database query performance
- Concurrent connection handling

✅ **Network Metrics:**
- Bandwidth usage
- Response size
- Request duration
- Failed requests (should be < 10%)

## Test Stages

1. **Ramp-up (2 min)**: 0 → 20 users
2. **Gradual Load (3 min)**: 20 → 50 users
3. **Heavy Load (4 min)**: 50 → 100 users
4. **Peak Load (5 min)**: 100 → 150 users  ← Critical test
5. **Ramp-down (3 min)**: 150 → 50 users
6. **Cool-down (2 min)**: 50 → 0 users

**Total Duration: ~19 minutes**

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Page Load Time (p95) | < 2s | < 3s |
| API Response (p95) | < 500ms | < 1s |
| API Response (p99) | < 1s | < 2s |
| Failed Requests | < 5% | < 10% |
| CPU Usage | < 70% | < 90% |
| Memory Usage | < 80% | < 95% |

## Step-by-Step Testing

### Step 1: Start Your Application
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: If you have a separate backend server
cd server && npm start

# Or deploy to Vercel and test against production URL
```

### Step 2: Monitor Performance
**Option A - Using DevTools:**
- Open Chrome DevTools (F12)
- Go to Performance tab
- Record while running the load test
- Look for dropped frames, long tasks

**Option B - Using Vercel Analytics:**
- Go to https://vercel.com/dashboard
- Check deployment metrics
- Monitor response times and errors

### Step 3: Run Load Test
```bash
# Install k6 first
# Then run:
k6 run performance-test.js

# For verbose output:
k6 run --vus 150 --duration 10m performance-test.js
```

### Step 4: Analyze Results
The test will show:
- ✅ Successful requests
- ❌ Failed requests
- ⏱️ Response times (min, max, avg, p95, p99)
- 📊 Requests per second
- 🔥 Any timeouts or errors

## Mobile Performance Testing

### Using DevTools Throttling:
1. Open DevTools → Network tab
2. Select "Slow 4G" or "Fast 3G"
3. Refresh page and check performance

### LightHouse Audit (Built-in):
```bash
# Run on your deployed URL
lighthouse https://your-site.vercel.app --view
```

### Simulating Mobile Network in k6:
```bash
k6 run --env THROTTLE=true performance-test.js
```

## Expected Results

### Good Performance ✅
- All pages load in < 2s
- No more than 5% failed requests
- Smooth animations (60 FPS)
- Mobile stays responsive
- No crashes at peak load

### Warning Signs ⚠️
- Response time > 3s
- More than 10% failed requests
- Dropped frames on mobile
- Memory usage > 90%
- Backend errors at peak

### Problems ❌
- Timeouts at high concurrency
- 50%+ failed requests
- UI freezes on mobile
- Server crashes
- Database connection errors

## Optimization Tips if Issues Found

1. **Slow Page Load:**
   - Enable Gzip compression
   - Minify CSS/JS
   - Lazy load images
   - Use CDN for static assets

2. **Slow APIs:**
   - Add database indexes
   - Cache more aggressively
   - Optimize queries
   - Add rate limiting

3. **High Memory Usage:**
   - Check for memory leaks
   - Reduce bundle size
   - Optimize state management

4. **Mobile Issues:**
   - Test on actual devices
   - Check network throttling
   - Optimize touch interactions

## Quick Commands

```bash
# Test locally for 5 minutes with 100 concurrent users
k6 run -u 100 -d 5m performance-test.js

# Test production Vercel deployment
k6 run --env URL=https://your-app.vercel.app performance-test.js

# Export results to JSON for analysis
k6 run performance-test.js -o json=results.json

# Test with specific request rate
k6 run -u 150 -r 10 performance-test.js
```

## Troubleshooting

**k6 not found:**
```bash
# Reinstall k6
# Windows: 
choco uninstall k6 && choco install k6

# Or add to PATH manually
```

**Connection refused:**
- Make sure your app is running on `localhost:5173`
- Check if the port is correct
- Try your Vercel deployment URL

**Too many errors:**
- Reduce concurrent users (`-u` flag)
- Increase ramp-up time
- Check server logs for issues

**Database lockouts:**
- The test data only reads/navigates
- No data modification happens
- Fixed user database won't be affected

## Next Steps

1. ✅ Run the test locally first
2. ✅ Fix any issues found
3. ✅ Deploy to Vercel
4. ✅ Test production deployment
5. ✅ Monitor real-world performance

---

**Questions?** Check server logs and performance metrics when errors occur.
