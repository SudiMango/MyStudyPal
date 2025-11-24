import { Metadata } from "next";
import VerifyAccount from "./VerifyAccount";

export const metadata: Metadata = {
    title: "Verify email",
    description: "Verify your email.",
};

const Page = () => {
    return <VerifyAccount />;
};

export default Page;
