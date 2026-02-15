import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import React from "react";

interface FlashcardNavigationProps {
    currIndex: number;
    totalFlashcards: number;
    onPrevious: () => void;
    onNext: () => void;
}

const NavigationControls: React.FC<FlashcardNavigationProps> = ({
    currIndex,
    totalFlashcards,
    onPrevious,
    onNext,
}) => {
    return (
        <div className="flex flex-row justify-center items-center my-4 space-x-5 w-full">
            <button
                onClick={onPrevious}
                className="bg-(--discord-blurple) rounded-full p-3 hover:bg-(--discord-blurple-hover)"
            >
                <ArrowBigLeft />
            </button>
            <label>
                {currIndex + 1}/{totalFlashcards}
            </label>
            <button
                onClick={onNext}
                className="bg-(--discord-blurple) rounded-full p-3 hover:bg-(--discord-blurple-hover)"
            >
                <ArrowBigRight />
            </button>
        </div>
    );
};

export default NavigationControls;
