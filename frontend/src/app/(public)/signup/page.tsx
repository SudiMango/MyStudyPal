import { Metadata } from "next";
import { Suspense } from "react";
import SignupPage from "./SignupPage";

export const metadata: Metadata = {
    title: "Signup",
    description: "Signup to MyStudyPal.",
};

const Page = () => {
    return (
        <Suspense>
            <SignupPage />
        </Suspense>
    );
};

export default Page;
