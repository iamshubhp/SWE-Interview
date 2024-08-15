import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CSAI Customer Support",
  description: "AI-powered customer support chat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
