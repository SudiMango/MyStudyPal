import { Metadata } from "next";
import { Suspense } from "react";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to MyStudyPal.",
};

const Page = () => {
    return (
        <Suspense>
            <LoginPage />
        </Suspense>
    );
};

export default Page;
