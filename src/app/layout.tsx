import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Space_Grotesk } from "next/font/google";
import { site } from "@/config/site";
import { GA_ID, META_PIXEL_ID } from "@/lib/analytics";
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

const title = "Електрика та розумний будинок під ключ у Кропивницькому | Sense House";
const description =
  "Проєктування, електромонтаж і розумний будинок під ключ у Кропивницькому та області. Електрика, світло, клімат, безпека, мережа й сценарії в одній системі.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
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
  robots: { index: true, follow: true },
};

/** ProfessionalService structured data — лише підтверджені дані. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description:
    "Електрика та розумний будинок під ключ: проєктування, електромонтаж, збірка щитів, автоматизація, безпека, мережа та резервне живлення.",
  url: site.url,
  telephone: site.phone.e164,
  sameAs: [site.social.instagram],
  areaServed: [
    { "@type": "City", name: "Кропивницький" },
    { "@type": "AdministrativeArea", name: "Кіровоградська область" },
  ],
  knowsAbout: [
    "Електромонтаж",
    "Проєктування електрики",
    "Розумний будинок",
    "Автоматизація будинку",
    "Монтаж електрощитів",
    "Резервне живлення",
    "Відеоспостереження",
    "Локальні мережі",
  ],
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
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

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
