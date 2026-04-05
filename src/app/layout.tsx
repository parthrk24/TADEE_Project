// src/app/layout.tsx
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { TransmissionProvider } from "@/context/TransmissionContext";

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Transmission Line Analyser",
  description: "EEPC17 - NIT Trichy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} ${inter.variable} antialiased`}>
        {/* Background image + overlay */}
        <div className="fixed inset-0 -z-10">
          <img src="/bg.jpg" alt="" className="w-full h-full object-cover" />
          {/* Dark purple overlay */}
          <div className="absolute inset-0 bg-purple-950/60" />
        </div>

        <TransmissionProvider>{children}</TransmissionProvider>
      </body>
    </html>
  );
}
