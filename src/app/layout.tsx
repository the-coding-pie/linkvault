import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import Providers from "@/Providers";
import Script from "next/script";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background text-foreground flex flex-col relative overflow-x-hidden overflow-y-auto bg-slate-50",
          inter.className
        )}
      >
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>

        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-07HLL8ZT7G"
            />
            <Script id="google-analytics">
              {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-07HLL8ZT7G');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
