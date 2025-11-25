import Header from "../components/global/Header";
import Footer from "../components/global/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <main className="flex grow items-center justify-center">
                {children}
            </main>
            <Footer />
        </>
    );
}
