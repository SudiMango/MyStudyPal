export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className="flex grow items-center justify-center w-full">
                {children}
            </main>
        </>
    );
}
