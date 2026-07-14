import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteNav } from "@/components/SiteNav";
import { SmoothScroll } from "@/components/SmoothScroll";

const display = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Loopfield — AuDHD Exploratory Map",
  description:
    "Find the loops you already live in. Explore patterned AuDHD experiences with scientific grounding and room for the unnamed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-[#07090f] text-[#e8eef5] antialiased">
        <Providers>
          <SmoothScroll>
            <SiteNav />
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
