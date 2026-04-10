import { Metadata } from "next";
import AttemptDetailsPage from "./AttemptDetailsPage";

export const metadata: Metadata = {
    title: "Attempt",
};

const Page = () => {
    return <AttemptDetailsPage />;
};

export default Page;
