import type { Metadata, Viewport } from "next";
import { notoSerifJP } from "@/lib/fonts";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "./globals.css";

// Font Awesome の自動CSSインジェクションを無効化（Next.jsではスタイルを手動でインポート）
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Kid's Finger",
  description: "詩のコレクション",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
