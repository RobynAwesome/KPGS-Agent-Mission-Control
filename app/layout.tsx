import type { Metadata } from "next";
import "./globals.css";
import MissionAtmosphere from "./MissionAtmosphere";

export const metadata: Metadata = {
  title: "KPGS Agent Mission Control",
  description: "A WebMCP-native governed mission control for human-agent collaboration."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MissionAtmosphere />
        <div className="missionWorld">{children}</div>
      </body>
    </html>
  );
}
