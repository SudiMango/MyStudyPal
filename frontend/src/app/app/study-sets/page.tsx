import { Metadata } from "next";
import StudySetsPage from "./StudySetsPage";

export const metadata: Metadata = {
    title: "Study sets",
    description: "My study sets.",
};

const Page = () => {
    return <StudySetsPage />;
};

export default Page;
