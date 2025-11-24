import { Metadata } from "next";
import SignupPage from "./SignupPage";

export const metadata: Metadata = {
    title: "Signup",
    description: "Signup to MyStudyPal.",
};

const Page = () => {
    return <SignupPage />;
};

export default Page;
