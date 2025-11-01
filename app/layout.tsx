import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DSA Progress Tracker ❤️',
  description: 'Track LeetCode progress together - Gaurav & Her Name',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fce7f3',
              color: '#be185d',
              borderRadius: '12px',
              padding: '16px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#ec4899',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
