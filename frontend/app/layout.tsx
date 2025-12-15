/* ========================================
   FILE: layout.tsx (FIXED FOR PROPER STRUCTURE)
   ======================================== */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NandiVision | AI-powered Cattle Breed Identification",
  description: "Smart AI Cattle Classifier using deep learning technology",
  keywords: ["cattle", "breed", "AI", "identification", "NandiVision"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark-theme">
      <body className={`${inter.className} app-body`}>
        <div className="app-wrapper">
          {children}
        </div>
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          theme="dark"
        />
      </body>
    </html>
  );
}