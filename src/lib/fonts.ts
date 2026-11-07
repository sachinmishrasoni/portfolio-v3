import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import localFont from 'next/font/local';

export const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
});

export const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const blackSignature = localFont({
    src: "../../public/fonts/blacksignature.otf",
    variable: '--font-signature',
    display: 'swap',
});

export const fontVariables = [
    spaceGrotesk.variable,
    inter.variable,
    geistMono.variable,
    geistSans.variable,
    blackSignature.variable
].join(" ");
