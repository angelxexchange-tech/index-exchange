import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ind-X - Next.js Mobile Application",
  description: "ind-X Mobile Application created with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} antialiased bg-slate-950 min-h-screen flex justify-center items-center font-sans m-0 p-0`}>
        {/* Shared Mobile Max-Width Container */}
        <main className="w-full max-w-[430px] h-screen max-h-[920px] relative overflow-hidden flex flex-col shadow-2xl bg-white font-sans">
          {children}
        </main>
      </body>
    </html>
  );
}
