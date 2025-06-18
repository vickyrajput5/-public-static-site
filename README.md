# Content Platform - Next.js Frontend

A modern content management platform built with Next.js, Strapi CMS, and Supabase. This application provides both a public-facing site for viewing content and an admin interface for managing content with real-time synchronization between Strapi and Supabase.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Headless CMS Integration**: Seamless integration with Strapi CMS
- **Real-time Database**: Supabase for real-time updates and data persistence
- **Bidirectional Sync**: Automatic synchronization between Strapi and Supabase
- **Admin Dashboard**: User-friendly interface for content management
- **Responsive Design**: Works perfectly on all device sizes
- **Type Safety**: Full TypeScript support throughout the application
- **State Management**: Redux Toolkit for efficient state management
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: User-friendly feedback with react-hot-toast

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit, React Redux
- **CMS**: Strapi (Headless CMS)
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or later
- **npm** or **yarn** package manager
- **Strapi CMS** instance running (with PostgreSQL database recommended)
- **Supabase** account and project

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd strapi-nextjs-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Strapi Configuration
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄 Database Setup

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create a `contents` table with the following schema:

```sql
CREATE TABLE contents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON contents
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage content" ON contents
  FOR ALL USING (auth.role() = 'authenticated');
```

3. Get your Supabase URL and anon key from the project settings

### Strapi Setup

1. Set up a Strapi project with PostgreSQL database
2. Create a `Content` content type with the following fields:
   - `title` (Text, required)
   - `description` (Text, required)
3. Configure permissions to allow public access to content
4. Generate an API token in Settings > API Tokens

## 🔄 Synchronization

The application includes a synchronization script that keeps Strapi and Supabase in sync:

```bash
# Run the sync script
npm run sync
# or
yarn sync
```

This script will:

- Sync content from Strapi to Supabase
- Sync content from Supabase to Strapi
- Handle conflicts and updates automatically

## 📁 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── admin/      # Admin dashboard pages
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Public homepage
│   ├── components/     # React components
│   │   ├── ContentCard.tsx
│   │   ├── ContentForm.tsx
│   │   ├── Navigation.tsx
│   │   └── Providers.tsx
│   ├── lib/            # Utility functions and services
│   │   ├── redux/      # Redux store and slices
│   │   ├── strapi/     # Strapi API services
│   │   ├── supabase/   # Supabase client and services
│   │   └── sync/       # Synchronization utilities
│   └── types/          # TypeScript type definitions
├── .env.local          # Environment variables
├── next.config.mjs     # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run sync` - Run synchronization script

## 🚀 Deployment

This application can be deployed to various platforms:

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

- **Netlify**: Configure build settings for Next.js
- **DigitalOcean App Platform**: Simple deployment with automatic scaling
- **Self-hosted**: Deploy to any server that supports Node.js

## 🔧 Configuration

### Environment Variables

| Variable                        | Description            | Required |
| ------------------------------- | ---------------------- | -------- |
| `NEXT_PUBLIC_STRAPI_API_URL`    | Strapi API URL         | Yes      |
| `STRAPI_API_TOKEN`              | Strapi API token       | Yes      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL   | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes      |

### Customization

- **Styling**: Modify `tailwind.config.ts` for theme customization
- **API Endpoints**: Update API calls in `src/lib/strapi/client.ts` and `src/lib/supabase/client.ts`
- **Content Types**: Extend the content schema in both Strapi and Supabase

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the maintainers for direct support

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Strapi](https://strapi.io/) for the headless CMS
- [Supabase](https://supabase.com/) for the backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
