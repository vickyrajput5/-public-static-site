import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Content Platform - Next.js Frontend",
  description:
    "A Next.js frontend application that integrates with Strapi CMS and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position='top-right' />
        </Providers>
      </body>
    </html>
  );
}
