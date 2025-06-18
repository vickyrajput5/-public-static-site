import { Content } from "@/types";

export const demoContents: Content[] = [
  {
    id: 1,
    title: "Welcome to Content Platform",
    description:
      "A modern content management platform built with Next.js, Strapi CMS, and Supabase. This demo shows how the application looks with sample content.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Getting Started Guide",
    description:
      "Learn how to set up and use the Content Platform for your projects. Follow the setup instructions to connect your Strapi CMS and Supabase database.",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "API Documentation",
    description:
      "Comprehensive documentation for the Content Platform API endpoints. Learn how to integrate with Strapi and Supabase for your applications.",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    title: "Real-time Synchronization",
    description:
      "Experience real-time content synchronization between Strapi CMS and Supabase database. Changes in one system automatically reflect in the other.",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 5,
    title: "Admin Dashboard Features",
    description:
      "Explore the powerful admin dashboard with full CRUD operations, real-time updates, and intuitive content management interface.",
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 6,
    title: "Responsive Design",
    description:
      "Built with modern responsive design principles, ensuring your content looks great on all devices from desktop to mobile.",
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
];
