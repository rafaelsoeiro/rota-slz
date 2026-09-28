import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rota SLZ",
  description: "Rotas e experiências em São Luís.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
