import type { Metadata, Viewport } from "next";
import { Noto_Serif_JP } from 'next/font/google';
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: "Kid's Finger",
  description: "詩のコレクション",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSerifJP.className}>
      <body>{children}</body>
    </html>
  );
}
