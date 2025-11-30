import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { Providers } from "./providers";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DSA Tracker",
  description: "Track your Data Structures and Algorithms progress",
};

const DynamicCustomStarfieldBackground = dynamic(
  () => import("@/components/CustomStarfieldBackground"),
  { ssr: false }
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthGuard>
            <Navbar />
            <div className="min-h-screen pt-16 pb-10 relative z-10">
              {children}
            </div>
            <Footer />
          </AuthGuard>
          <DynamicCustomStarfieldBackground />
        </Providers>
      </body>
    </html>
  );
}
