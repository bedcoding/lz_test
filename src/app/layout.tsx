import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@/components/layout/StyledComponentsRegistry";
import ThemeProvider from "@/components/layout/ThemeProvider";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "웹툰 랭킹 | 로맨스·드라마 인기 작품 순위",
  description: "로맨스·드라마 장르 웹툰 실시간 랭킹을 확인하세요. 연재중, 완결, 무료회차별 필터링으로 원하는 작품을 쉽게 찾아보세요.",
  keywords: "웹툰랭킹, 로맨스웹툰, 드라마웹툰, 인기웹툰, 무료웹툰, 완결웹툰, 연재중웹툰",
  authors: [{ name: "Lezhin Entertainment" }],
  robots: "index, follow",
  openGraph: {
    title: "웹툰 랭킹 | 로맨스·드라마 인기 작품 순위",
    description: "로맨스·드라마 장르 웹툰 실시간 랭킹을 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "웹툰 랭킹",
  },
  twitter: {
    card: "summary_large_image",
    title: "웹툰 랭킹 | 로맨스·드라마 인기 작품 순위",
    description: "로맨스·드라마 장르 웹툰 실시간 랭킹을 확인하세요.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.variable}>
        <StyledComponentsRegistry>
          <QueryProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
