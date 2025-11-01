'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div 
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}
      style={{ backgroundColor: '#000000' }}
    >
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
