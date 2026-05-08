import type { Metadata } from "next";
import { Orbitron, Exo_2, Share_Tech_Mono } from "next/font/google";
import "@/styles/globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SPACE EXPLORATION HUB — The Cinematic Space Journey",
  description:
    "A cinematic journey through the solar system. From the Sun to Neptune, explore the cosmos interactively.",
  keywords: ["space", "exploration", "NASA", "cosmos", "cinematic", "interactive"],
  openGraph: {
    title: "SPACE EXPLORATION HUB",
    description: "The Cinematic Space Journey",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${exo2.variable} ${shareTechMono.variable} bg-black text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
