import "./globals.css";
import "./shepherd-custom.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import Chatbot from "@/components/chatbot";
import LanguageSelector from "@/components/language-selector";
import MagnifyingGlass from "@/components/magnifying-glass";
import WebTour from "@/components/web-tour";

export const metadata: Metadata = {
  title: "सहाय - Sahay App",
  description: "Fund management and tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="page-content">
          <AuthProvider>
            <LanguageSelector />
            <MagnifyingGlass />
            {children}
            <Chatbot />
            <WebTour />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
