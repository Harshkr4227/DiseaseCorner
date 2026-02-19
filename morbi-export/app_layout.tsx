import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const crimsonPro = Crimson_Pro({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-crimson-pro"
});

export const metadata: Metadata = {
  title: "Morbi",
  description: "Instant disease information including definition, symptoms, causes, treatments, and prevention.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, crimsonPro.variable, "min-h-screen bg-background font-sans antialiased flex flex-col")}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
