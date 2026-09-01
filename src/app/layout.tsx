import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Elite Dashboard | Escola de Elite",
    template: "%s | Elite Dashboard",
  },
  description:
    "Plataforma Full-Stack corporativa de gestao escolar, Business Intelligence e controle analitico de alta performance.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "Next.js 14",
    "Prisma 7",
    "Supabase",
    "PostgreSQL",
    "Business Intelligence",
    "School Management",
    "TypeScript",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-950 text-stone-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
