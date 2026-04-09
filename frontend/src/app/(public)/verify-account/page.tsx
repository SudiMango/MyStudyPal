import { Metadata } from "next";
import { Suspense } from "react";
import VerifyAccount from "./VerifyAccount";

export const metadata: Metadata = {
    title: "Verify email",
    description: "Verify your email.",
};

const Page = () => {
    return (
        <Suspense>
            <VerifyAccount />
        </Suspense>
    );
};

export default Page;
