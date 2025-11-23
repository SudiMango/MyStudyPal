import { ChevronDown, ChevronUp, CircleQuestionMark } from "lucide-react";
import React, { useState } from "react";

const FAQ = () => {
    const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

    const handleShowFaqQuestion = (index: number) => {
        if (faqOpenIndex === index) {
            setFaqOpenIndex(null);
        } else {
            setFaqOpenIndex(index);
        }
    };

    const faqs = [
        {
            question: "Is MyStudyPal free to use?",
            answer: "Yes! We have a free forever plan that gives you access to basic flashcard generation and study tracking. You can upgrade anytime for unlimited AI features.",
        },
        {
            question: "Is using this considered cheating?",
            answer: "Not at all. We focus on ethical AI that acts as a tutor, helping you understand concepts and organize your schedule rather than doing the work for you.",
        },
        {
            question: "Can I upload my own notes?",
            answer: "Absolutely. You can upload PDFs, PowerPoints, or paste text directly. Our AI will generate custom study materials based specifically on your course content.",
        },
        {
            question: "How accurate is the AI?",
            answer: "Our models are highly accurate, but we always recommend reviewing the generated cards. You have full control to edit or delete any content the AI creates.",
        },
        {
            question: "Is there a mobile app?",
            answer: "Currently, MyStudyPal is a fully responsive web application that works perfectly on any device, including smartphones and tablets. We are developing dedicated iOS and Android apps and plan to release them later this year.",
        },
        {
            question:
                "Can it handle complex STEM subjects like Math and Chemistry?",
            answer: "Yes, our underlying Gemini AI models are highly capable in mathematical and scientific domains. They can generate flashcards that include LaTeX-formatted equations ($$\frac{d}{dx}f(x)$$) and complex chemical structures, ensuring high fidelity for your STEM subjects.",
        },
        {
            question: "How is my data and privacy protected?",
            answer: "We take privacy seriously. Your uploaded notes and study progress are stored securely using Firestore, and we use Firebase Authentication to ensure only you have access to your private study data. We do not sell or share your personal study materials with third parties.",
        },
    ];

    return (
        <div
            id="faq"
            className="flex flex-col justify-center items-center w-full max-w-[800px] mb-10 px-5 [@media(min-width:850px)]:px-0"
        >
            <div className="flex flex-row justify-center items-center mr-auto text-sm mt-5">
                <CircleQuestionMark className="h-5 w-5 text-(--discord-blurple) mr-1.5" />
                <label className="text-(--discord-blurple)">FAQ</label>
            </div>

            <label className="mr-auto font-bold text-3xl my-3">
                Got questions?
            </label>

            <div className="flex flex-col border border-(--discord-blurple) rounded-xl w-full max-w-[800px] px-4">
                {faqs.map((f, i) => (
                    <button
                        onClick={() => handleShowFaqQuestion(i)}
                        key={i}
                        className={`py-3 flex flex-col group ${
                            i === faqs.length - 1
                                ? ""
                                : "border-b border-(--discord-gray-2)"
                        }`}
                    >
                        <div className="flex flex-row items-center">
                            <label className="text-lg text-left mr-2">
                                {f.question}
                            </label>
                            {faqOpenIndex === i ? (
                                <ChevronUp className="ml-auto mr-2 group-hover:text-(--discord-blurple)" />
                            ) : (
                                <ChevronDown className="ml-auto mr-2 group-hover:text-(--discord-blurple)" />
                            )}
                        </div>
                        <label
                            className={`${
                                faqOpenIndex === i ? "" : "hidden"
                            } text-sm mt-2 opacity-70 text-left`}
                        >
                            {f.answer}
                        </label>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
