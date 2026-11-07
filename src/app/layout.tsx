import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../styles/globals.css";
import ScrollProgress from "@/components/common/ScrollProgress";
import ThemeProvider from "@/providers/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/config/site.config";
import Preloader from "@/components/common/Preloader";

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
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ScrollProgress />
          <Header />
          <Preloader />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
