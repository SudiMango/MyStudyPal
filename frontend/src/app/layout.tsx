import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/global/AuthProvider";
import { Metadata } from "next";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | MyStudyPal",
        default: "MyStudyPal",
    },
    description: "Your ultimate study companion.",
    icons: {
        icon: [],
    },
    openGraph: {
        title: "MyStudyPal",
        description: "Your ultimate study companion.",
        url: "https://mystudypal.sudicodes.xyz",
        siteName: "MyStudyPal",
        images: [
            {
                url: "https://mystudypal.sudicodes.xyz/preview.png",
                width: 804,
                height: 405,
                alt: "MyStudyPal",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "MyStudyPal",
        description: "Your ultimate study companion.",
        images: ["https://mystudypal.sudicodes.xyz/preview.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased flex flex-col min-h-screen`}
            >
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
