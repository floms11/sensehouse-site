import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Space_Grotesk } from "next/font/google";
import { site } from "@/config/site";
import { GA_ID, META_PIXEL_ID } from "@/lib/analytics";
import CleanAnchorNavigation from "@/components/CleanAnchorNavigation";
import "./globals.css";

/**
 * Manrope підтримує кирилицю і несе весь український текст.
 * Space Grotesk не має кириличних гліфів, тому використовується
 * лише для латинських display-елементів: wordmark, номери етапів,
 * технічні надписи.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const title =
  "Електрика під ключ і розумний дім у Кропивницькому | Sense House";
const description =
  "Проєктуємо та реалізуємо електрику й розумний дім під ключ у Кропивницькому та області: електрощити, світло, клімат, безпека, резерв і мережа.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  verification: {
    google: "JdFg6khabtCS_LctQagntWk7Ppwq_xZUVUbS9HinVA4",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CleanAnchorNavigation />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-button focus:bg-blue focus:px-5 focus:py-3 focus:font-semibold focus:text-navy-deep"
        >
          Перейти до змісту
        </a>
        {children}

        {/* Аналітика підключається лише за наявності справжніх ID у env */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
