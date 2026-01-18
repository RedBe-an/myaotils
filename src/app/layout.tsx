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
  title: {
    template: '%s | Myaotils',
    default: 'Myaotils',
  },
  description: "A collection of useful utilities for developers and students.",
  keywords: [
    "Myaotils",
    "유틸리티",
    "도구",
    "툴",
    "개발자 도구",
    "학생 도구",
    "웹 도구",
    "온라인 도구",
    "무료 도구",
    "생산성",
    "웹앱",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "UI",
    "UX",
    "디자인 시스템",
    "shadcn/ui",
    "블로그",
    "문서",
    "MDX",
    "글",
    "포스트",
    "글쓰기",
    "유틸 모음",
    "작업 자동화",
    "포맷터",
    "텍스트",
    "문자",
    "카운터",
    "문자수",
    "글자수",
    "텍스트 변환",
    "ASCII",
    "인코딩",
    "디코딩",
    "랜덤",
    "랜덤 픽커",
    "추첨",
    "선택기",
    "다운로더",
    "음악 다운로더",
    "미디어",
    "파일",
    "문서 변환",
    "PDF",
    "KICE",
    "한국교육과정평가원",
    "수능",
    "모의고사",
    "국어",
    "영어",
    "수학",
    "문제",
    "해설",
    "자료",
    "학습",
    "공부",
    "리소스",
    "규칙",
    "Voynich",
    "보이니치",
    "암호",
    "암호문",
    "알고리즘",
    "텍스트 분석",
    "패턴",
    "데이터",
    "CSV",
    "다운로드",
    "유용한 도구",
    "학생 유틸",
    "개발 유틸",
    "웹 유틸",
    "커스텀 폰트",
    "한글 폰트",
    "코드",
    "개발",
    "프로그래밍",
    "프로젝트",
    "오픈소스",
    "가이드",
    "레퍼런스",
    "툴박스",
    "유틸리티 모음",
  ],
  verification: {
    google: "QWitR0AsUG-rAScuvX4143iDc2AkAwi-T6hmsGOUKKU",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/pawcon.png',
    shortcut: '/pawcon.png',
    apple: '/pawcon.png',
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
