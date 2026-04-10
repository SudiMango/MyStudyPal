import { Metadata } from "next";
import QuizAttemptPage from "./QuizAttemptPage";

export const metadata: Metadata = {
    title: "Quiz",
};

const Page = () => {
    return <QuizAttemptPage />;
};

export default Page;
