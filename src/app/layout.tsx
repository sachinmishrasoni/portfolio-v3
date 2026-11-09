import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../styles/globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import { SITE_CONFIG } from "@/config/site.config";
import Preloader from "@/components/common/Preloader";
import { Toaster } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.seo.defaultTitle,
    template: SITE_CONFIG.seo.titleTemplate,
  },
  description: SITE_CONFIG.seo.defaultDescription,
  openGraph: {
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#FAF9FF" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Preloader />
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
