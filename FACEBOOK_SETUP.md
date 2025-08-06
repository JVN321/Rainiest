# Facebook API Setup Guide

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Business" as app type
4. Fill in app details:
   - App Name: "Kerala Weather Dashboard"
   - App Contact Email: your-email@example.com

## Step 2: Configure App Permissions

1. Go to your app dashboard
2. Add "Facebook Login" product
3. In App Review → Permissions and Features:
   - Request `pages_read_engagement` permission
   - Request `pages_show_list` permission

## Step 3: Get Access Token

### Option A: Quick Test (Short-lived token)
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Add permissions: `pages_read_engagement`, `pages_show_list`
4. Click "Generate Access Token"
5. Copy the token (valid for 1 hour)

### Option B: Long-lived Token (Production)
1. First get a short-lived user access token (Option A)
2. Exchange it for a long-lived token:
```bash
curl -i -X GET "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id={your-app-id}&client_secret={your-app-secret}&fb_exchange_token={short-lived-token}"
```
3. Use the long-lived token to get page access tokens:
```bash
curl -i -X GET "https://graph.facebook.com/me/accounts?access_token={long-lived-token}"
```

## Step 4: Test API Access

1. Create `.env.local` file:
```bash
FACEBOOK_ACCESS_TOKEN=your_token_here
```

2. Test the connection:
```bash
npm run test-fb
```

## Step 5: Understanding Permissions

### Required Permissions:
- `pages_read_engagement`: Read posts from pages
- `pages_show_list`: Access page information

### Page Access:
- Public pages: Can read posts without special permission
- Private pages: Need page admin access or business verification

## Step 6: District Collector Pages

The app tries to fetch from these pages:
- Thiruvananthapuram: facebook.com/collectortvpm
- Kollam: facebook.com/dckollam
- Pathanamthitta: facebook.com/dc.pathanamthitta
- Alappuzha: facebook.com/districtcollectoralappuzha
- Kottayam: facebook.com/collectorkottayam
- Idukki: facebook.com/collectoridukki
- Ernakulam: facebook.com/dcekm
- Thrissur: facebook.com/thrissurcollector
- Palakkad: facebook.com/DISTRICTCOLLECTORPALAKKAD
- Malappuram: facebook.com/malappuramcollector
- Kozhikode: facebook.com/CollectorKKD
- Wayanad: facebook.com/wayanadWE
- Kannur: facebook.com/CollectorKNR
- Kasaragod: facebook.com/KasaragodCollector

## Common Issues

### "Invalid OAuth access token"
- Token expired (get new one)
- Wrong app ID/secret
- Token doesn't have required permissions

### "Unsupported get request"
- Page doesn't exist or is private
- Page name/ID is incorrect
- Need different permissions

### Rate Limiting
- Facebook limits API calls (200 calls per hour per user)
- Add delays between requests
- Use webhook for real-time updates instead

## Production Deployment

For Vercel deployment:
1. Add environment variable in Vercel dashboard
2. Use long-lived tokens
3. Consider caching responses
4. Implement error handling for rate limits

## Testing Commands

```bash
# Test Facebook API connection
npm run test-fb

# Run development server
npm run dev

# Build for production
npm run build
```
