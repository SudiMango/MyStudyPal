import { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to MyStudyPal.",
};

const Page = () => {
    return <LoginPage />;
};

export default Page;
