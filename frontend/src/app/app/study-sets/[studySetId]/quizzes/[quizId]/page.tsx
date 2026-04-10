import { Metadata } from "next";
import QuizViewPage from "./QuizViewPage";

export const metadata: Metadata = {
    title: "Study sets",
    description: "My study sets.",
};

const Page = () => {
    return <QuizViewPage />;
};

export default Page;
