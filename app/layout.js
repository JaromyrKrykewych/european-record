import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "European Football Stats",
  description:
    "This is a not official site for European football stats, head to heat in european competitions, titles, participations, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className=" mx-auto py-10 px-8">
          {" "}
          {/* max-w-7xl */}
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
