import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rudin Events Discovery",
  description: "AI-powered local event discovery for Rudin properties",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
