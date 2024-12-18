import type { Metadata } from "next";
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
