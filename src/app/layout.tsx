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
  title: "ind-X - Exchange Platform & Admin Portal",
  description: "ind-X Mobile Application and SaaS Admin Portal created with Next.js",
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
