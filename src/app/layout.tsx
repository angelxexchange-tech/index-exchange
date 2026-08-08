import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://indxexchange.com"),
  title: "IndX → USDT selling Platform",
  description: "Log in to IndX for instant USDT-to-INR conversions at the best market rates. Fast processing, secure payouts, reliable support—exchange your crypto easily now!",
  keywords: "IndX USDT Price, IndX Crypto, IndX USDT Sell, IndX Apk, IndX Exchange, IndX USDT Exchange, IndX USDT-to-INR",
  verification: {
    google: "zeJGjFAnu7kVPu10k5hHLu8AP-BvJPZ7Y6L8wY7cZ7Q",
  },
  alternates: {
    canonical: "https://indxexchange.com/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased bg-slate-950 min-h-screen font-sans m-0 p-0`}
        suppressHydrationWarning
      >
        {isAdmin ? (
          <div className="w-full min-h-screen relative bg-slate-950 text-slate-100 font-sans" suppressHydrationWarning>
            {children}
          </div>
        ) : (
          <div className="min-h-screen flex justify-center items-center bg-slate-950" suppressHydrationWarning>
            {/* Shared Mobile Max-Width Container for User App */}
            <main className="w-full max-w-[430px] h-screen max-h-[920px] relative overflow-hidden flex flex-col shadow-2xl bg-white font-sans" suppressHydrationWarning>
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
