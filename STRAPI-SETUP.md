# 🚀 Quick Strapi Setup Guide

Get your Strapi CMS running in 5 minutes!

## Step 1: Create Strapi Project

```bash
# Create a new Strapi project
npx create-strapi-app@latest my-strapi-app --quickstart

# Or if you want to use a specific database
npx create-strapi-app@latest my-strapi-app --dbclient=postgres --dbhost=localhost --dbport=5432 --dbname=strapi --dbusername=postgres --dbpassword=password
```

## Step 2: Set Up Content Type

1. **Start Strapi** (if not already running):

   ```bash
   cd my-strapi-app
   npm run develop
   ```

2. **Create Admin Account**:

   - Go to http://localhost:1337/admin
   - Create your first admin user

3. **Create Content Type**:
   - Go to Content-Type Builder
   - Click "Create new collection type"
   - Name it "Content"
   - Add these fields:
     - `title` (Text, required)
     - `description` (Text, required)
   - Save and publish

## Step 3: Configure Permissions

1. Go to Settings > Users & Permissions plugin > Roles
2. Click on "Public"
3. Enable these permissions for "Content":
   - `find` (to read content)
   - `findOne` (to read single content)
4. Save

## Step 4: Generate API Token

1. Go to Settings > API Tokens
2. Click "Create new API Token"
3. Fill in:
   - Name: "Content Platform Token"
   - Description: "Token for Content Platform integration"
   - Token duration: "Unlimited"
   - Token type: "Full access"
4. Copy the generated token

## Step 5: Update Environment Variables

Add the token to your `.env.local` file:

```env
STRAPI_API_TOKEN=your-generated-token-here
```

## Step 6: Test the Connection

1. Restart your Next.js app: `npm run dev`
2. Visit http://localhost:3000
3. You should see your content from Strapi!

## 🎯 What You'll See

- ✅ Strapi admin panel at http://localhost:1337/admin
- ✅ Content management interface
- ✅ API endpoints at http://localhost:1337/api/contents
- ✅ Integration with your Next.js app

## 🆘 Troubleshooting

**Port 1337 already in use?**

```bash
# Kill the process using port 1337
npx kill-port 1337
# Then restart Strapi
```

**Permission denied errors?**

- Make sure you've enabled the correct permissions in Strapi
- Check that your API token has the right permissions

**Connection refused?**

- Make sure Strapi is running on http://localhost:1337
- Check that your `.env.local` has the correct URL

Happy coding! 🎉
