import { Metadata } from "next";
import FlashcardsPage from "./FlashcardsPage";

export const metadata: Metadata = {
    title: "Review flashcards",
    description: "View your flashcards.",
};

const Page = () => {
    return <FlashcardsPage />;
};

export default Page;
