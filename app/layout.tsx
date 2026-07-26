import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Romain Delage — Portfolio · développeur, de l'idée à la production",
  description:
    "Portfolio de Romain Delage, développeur. Apps mobiles, SaaS, macOS natif — conçus, codés et déployés de bout en bout. Disponible pour des missions freelance.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%3E%3Crect%20width='32'%20height='32'%20fill='%230A0A0A'/%3E%3Crect%20x='9'%20y='9'%20width='14'%20height='14'%20fill='%23FF5A1F'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="snap-on">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
