# 🚀 Quick Start Guide

Get your Content Platform up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A Strapi CMS instance (or create one with `npx create-strapi-app@latest my-strapi-app`)

## Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd strapi-nextjs-frontend
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the script to create the database schema

## Step 3: Set Up Strapi

1. Create a new Strapi project (if you haven't already):

   ```bash
   npx create-strapi-app@latest my-strapi-app --quickstart
   ```

2. In your Strapi admin panel:

   - Go to Content-Type Builder
   - Create a new "Content" type
   - Add fields: `title` (Text) and `description` (Text)
   - Save and publish

3. Go to Settings > API Tokens
   - Create a new token with "Full access" permissions
   - Copy the token

## Step 4: Configure Environment

Run the setup script:

```bash
npm run setup
```

Or manually create `.env.local`:

```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-token
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step 5: Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🎯 What You'll See

- **Homepage**: Public view of all content
- **Admin Panel**: Manage content at `/admin`
- **Real-time Sync**: Changes sync between Strapi and Supabase

## 🔧 Next Steps

- Add authentication
- Customize the content schema
- Deploy to production
- Add more features

## 🆘 Need Help?

- Check the [main README](README.md) for detailed documentation
- Run `npm run sync` to manually sync data between Strapi and Supabase
- Open an issue if you encounter problems

Happy coding! 🎉
