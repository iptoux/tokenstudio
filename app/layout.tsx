import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/token-studio/navbar";
import { Footer } from "@/components/token-studio/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Token Studio - JSON to YAML to TOON Converter",
  description: "Paste JSON, explore alternate formats, and see how token counts change for different encodings. Convert JSON to YAML, TOON, TOML and more.",
  openGraph: {
    title: "Token Studio - JSON to YAML to TOON Converter",
    description: "Paste JSON, explore alternate formats, and see how token counts change for different encodings. Convert JSON to YAML, TOON, TOML and more.",
    type: "website",
    images: [
      {
        url: "/tokenstudio-logo.png",
        width: 1200,
        height: 630,
        alt: "Token Studio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Token Studio - JSON to YAML to TOON Converter",
    description: "Paste JSON, explore alternate formats, and see how token counts change for different encodings.",
    images: ["/tokenstudio-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <Navbar />
        {children}
        <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
