import type { Metadata } from "next";
import StyledComponentsRegistry from "@/components/layout/StyledComponentsRegistry";
import ThemeProvider from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: "로맨스 장르 랭킹",
  description: "인기 로맨스 웹툰 랭킹을 확인하세요",
  keywords: "웹툰, 로맨스, 랭킹",
  authors: [{ name: "Lezhin Entertainment" }],
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
