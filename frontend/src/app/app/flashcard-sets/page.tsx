import { Metadata } from "next";
import FlashcardSetsPage from "./FlashcardSetsPage";

export const metadata: Metadata = {
    title: "Flashcard sets",
    description: "My flashcard sets.",
};

const Page = () => {
    return <FlashcardSetsPage />;
};

export default Page;
