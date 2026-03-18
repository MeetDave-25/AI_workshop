# Quick Performance Testing Commands

## Using k6 (Recommended)

### Installation
```bash
# Windows
choco install k6
# OR
scoop install k6
# OR download: https://github.com/grafana/k6/releases
```

### Run Tests
```bash
# Test locally (localhost:5173)
k6 run performance-test.js

# Test production Vercel
k6 run --vus 150 --duration 10m performance-test.js

# With verbose output
k6 run -v performance-test.js

# Export results
k6 run --out json=results.json performance-test.js
```

---

## Using Locust (Alternative)

### Installation
```bash
pip install locust
```

### Run Tests
```bash
# Recommended: 150 users ramping at 10 users/sec for 10 minutes
locust -f locustfile.py --host=http://localhost:5173 -u 150 -r 10 --run-time 10m

# Web UI mode (recommended for visualization)
locust -f locustfile.py --host=http://localhost:5173 --web

# Then open browser to http://localhost:8089
# Set users and spawn rate in the UI
```

---

## What to Look For

### Should See ✅
- **95th percentile response time < 500ms**
- **99th percentile response time < 1000ms**
- **Failed requests < 5%**
- **No timeouts or connection errors**
- **Page loads < 2s**
- **Images load < 5s**

### Warning Signs ⚠️
- Response time spikes above 1s
- More than 10% failed requests
- Increasing error rate at peak load
- High CPU/memory usage

### Critical Issues ❌
- More than 50% failed requests
- Connection timeouts
- Server crashes
- UI freezes on mobile
- Errors in browser console

---

## Complete Test Workflow

### 1. Start Your App
```bash
# Terminal 1
npm run dev
```

### 2. In Another Terminal - Run Load Test
```bash
# Option A: k6
k6 run performance-test.js

# Option B: Locust
locust -f locustfile.py --host=http://localhost:5173 -u 150 -r 10 --run-time 10m
```

### 3. Monitor While Testing
- Open DevTools (F12) → Performance tab
- Watch for dropped frames
- Check Network tab for failed requests
- Monitor console for errors

### 4. Review Results
- k6: Shows summary in terminal
- Locust: Shows web UI with live graphs

---

## Test Scenarios Covered

✅ **Homepage Load** - Most frequent task  
✅ **Navigation** - All sections (About, Team, Tools, etc.)  
✅ **Image Loading** - All team member avatars  
✅ **Admin Pages** - Dashboard, students, prompts, scanner  
✅ **Concurrent Users** - 0 → 150 users ramp-up  
✅ **Mobile Network** - Simulated with throttling  

---

## Performance Targets by Load

| Users | Target P95 | Target P99 | Failed % |
|-------|-----------|-----------|----------|
| 20    | < 200ms   | < 300ms   | < 1%     |
| 50    | < 300ms   | < 500ms   | < 2%     |
| 100   | < 400ms   | < 800ms   | < 5%     |
| 150   | < 500ms   | < 1000ms  | < 5%     |

---

## Troubleshooting

**"k6: command not found"**
```bash
# Check if k6 is in PATH
where k6  # Windows
which k6  # Mac/Linux

# If not found, reinstall
choco uninstall k6 && choco install k6
```

**"Connection refused"**
- Verify your app is running on localhost:5173
- Check the correct port: `netstat -ano | findstr :5173`
- For Vercel: use your production URL

**"Too many errors"**
- Reduce users: `-u 50` instead of `-u 150`
- Increase ramp-up time: `-r 5` instead of `-r 10`
- Check server logs for database issues

**"Tests run but no results"**
```bash
# Try with explicit output
k6 run -d 1m --vus 50 performance-test.js
```

---

## Next: Test Production Deployment

Once local tests pass, deploy and test your Vercel URL:

```bash
# Test your deployed site
k6 run --vus 150 performance-test.js \
  --env URL=https://your-app.vercel.app
```

Monitor on Vercel Dashboard:
- https://vercel.com/dashboard → Your Project → Analytics
- Check: Response time, Redirects, 4xx/5xx errors

---

## Need More Help?

- **k6 Docs**: https://k6.io/docs/
- **Locust Docs**: https://docs.locust.io/
- **Web Performance**: https://web.dev/performance/
- **Chrome DevTools**: https://developer.chrome.com/docs/devtools/

Good luck with your stress testing! 🚀
