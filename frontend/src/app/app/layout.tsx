import AppSidebar from "../components/global/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className="flex flex-row grow w-full h-full">
                <AppSidebar />
                <div className="flex-1 overflow-y-auto">{children}</div>
            </main>
        </>
    );
}
