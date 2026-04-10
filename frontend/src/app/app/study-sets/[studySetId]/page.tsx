import { Metadata } from "next";
import CurrentStudySetPage from "./CurrentStudySetPage";

export const metadata: Metadata = {
    title: "Study sets",
    description: "My study sets.",
};

const Page = () => {
    return <CurrentStudySetPage />;
};

export default Page;
