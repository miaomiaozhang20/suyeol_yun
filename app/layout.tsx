import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DTxDS Content Co-Creator',
  description: 'AI-powered startup artifact creation for founders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-xl font-semibold">DTxDS Content Co-Creator</h1>
                <nav className="flex space-x-4">
                  <a href="/" className="text-gray-700 hover:text-gray-900">Dashboard</a>
                  <a href="/artifacts" className="text-gray-700 hover:text-gray-900">Artifacts</a>
                </nav>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}