import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans, Gloria_Hallelujah } from "next/font/google";
import { cn } from "./components/utils";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cabinSketch = Gloria_Hallelujah({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-crayon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digi Hamster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          cabinSketch.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
