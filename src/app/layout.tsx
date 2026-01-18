import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Head } from "next/document";

const freesentation = localFont({
  src: "../assets/fonts/Freesentation/FreesentationVF.ttf",
  variable: "--font-freesentation",
  weight: "100 900",
  display: "swap",
});

const paperlogy = localFont({
  src: [
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-1Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-2ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-3Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-4Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-5Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-6SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-7Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-8ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/Paperlogy/Paperlogy-9Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-paperlogy",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Myaotils",
  description: "A collection of useful utilities for developers and students.",
  verification: {
    google: "QWitR0AsUG-rAScuvX4143iDc2AkAwi-T6hmsGOUKKU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${freesentation.variable} ${paperlogy.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
