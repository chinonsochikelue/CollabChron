import Navbar from "@/components/navbar/Navbar";
import "./globals.css";
import '@mantine/tiptap/styles.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core'
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from '@next/third-parties/google';
import GoogleAdsense from "../components/GoogleAdsense";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://www.collabchron.com.ng'),
  title: {
    default: "CollabChron",
    template: "%s - CollabChron",
  },
  description:
    "CollabChron is a dynamic multi-author blog platform where writers and readers connect. Discover diverse perspectives, share your voice, and explore captivating stories on topics ranging from technology and lifestyle to culture and beyond.",
  alternates: {
    canonical: "/",
    languages: {
      en: "https://www.collabchron.com.ng",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      new URL('/favicon.ico', 'https://www.collabchron.com.ng'),
      { url: '/favicon.ico', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: ['/shortcut-icon.png'],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  manifest: 'https://www.collabchron.com.ng/manifest.json',
  openGraph: {
    title: "Home - CollabChron",
    description:
      "CollabChron is a dynamic multi-author blog platform where writers and readers connect. Discover diverse perspectives, share your voice, and explore captivating stories on topics ranging from technology and lifestyle to culture and beyond.",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "Banner Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home - CollabChron",
    description:
      "CollabChron is a dynamic multi-author blog platform where writers and readers connect. Discover diverse perspectives, share your voice, and explore captivating stories on topics ranging from technology and lifestyle to culture and beyond.",
    images: ["/favicon.ico"],
  },
  category: 'technology, ai, news, sports, fashion, entertainment, coding, culture, styles, machine learning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <meta name="msvalidate.01" content="4BB8182AAAC464C950E2F99FE3546368" />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID} />
      <body
        className={`${inter.className} w-full min-h-screen dark:text-white text-slate-800 dark:bg-[#020b19] bg-white`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MantineProvider>
              <div className="w-full max-w-screen overflow-x-hidden">
                <Toaster />
                <Navbar />
                <main>{children}</main>
                <Footer />
              </div>
            </MantineProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

