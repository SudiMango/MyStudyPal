import { Toaster } from "sonner";
import AppSidebar from "../components/global/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className="flex flex-col md:flex-row grow w-full h-full">
                <AppSidebar />
                <div className="flex-1 overflow-y-auto">
                    {children}
                    <Toaster position="top-right" richColors theme="dark" />
                </div>
            </main>
        </>
    );
}
