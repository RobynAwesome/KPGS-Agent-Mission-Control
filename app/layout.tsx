import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KPGS Agent Mission Control",
  description: "A WebMCP-native governed mission control for human-agent collaboration."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
