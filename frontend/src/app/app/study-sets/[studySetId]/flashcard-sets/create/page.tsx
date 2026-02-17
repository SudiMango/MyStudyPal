import { Metadata } from "next";
import CreateFlashcardSetPage from "./CreateFlashcardSetPage";

export const metadata: Metadata = {
    title: "Create set",
    description: "Create a flashcard set.",
};

const Page = () => {
    return <CreateFlashcardSetPage />;
};

export default Page;
