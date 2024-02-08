import type { Metadata } from "next";
import { MantineProvider } from "@mantine/core";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "./components/utils";
import { ThemeProvider } from "./components/ThemeProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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
          fontSans.variable
        )}
      >
        <MantineProvider defaultColorScheme="dark" forceColorScheme="dark">
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
