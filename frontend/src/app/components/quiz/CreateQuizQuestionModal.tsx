import React, { useEffect, useRef, useState } from "react";
import {
    SharedFields,
    ShortAnswerBody,
    TrueFalseBody,
    ChoiceBody,
    QUESTION_TYPE_LABELS,
    QUESTION_TYPE_DESCRIPTIONS,
    QUESTION_TYPE_BADGE,
    isQuestionValid,
    buildQuestionPayload,
    inputCls,
    labelCls,
} from "./QuizQuestionFormShared";
import {
    CreateQuizQuestionRequest,
    QuestionType,
} from "@/lib/dto/quiz-question-dto";
import AbstractModal from "../global/AbstractModal";

const ALL_QUESTION_TYPES: QuestionType[] = [
    QuestionType.SHORT_ANSWER,
    QuestionType.TRUE_FALSE,
    QuestionType.MULTIPLE_CHOICE,
    QuestionType.MULTIPLE_ANSWER,
];

const DEFAULT_OPTIONS = ["", ""];

interface CreateQuizQuestionModalProps {
    isOpen: boolean;
    onConfirm: (req: CreateQuizQuestionRequest) => void;
    onCancel: () => void;
    isLoading: boolean;
    totalQuestions: number;
}

const CreateQuizQuestionModal: React.FC<CreateQuizQuestionModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    isLoading,
    totalQuestions,
}) => {
    const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [hint, setHint] = useState("");
    const [points, setPoints] = useState("");
    const [orderIndex, setOrderIndex] = useState(String(totalQuestions + 1));

    const prevIsOpen = useRef(false);

    // Reset all state when modal opens
    useEffect(() => {
        if (isOpen && !prevIsOpen.current) {
            setSelectedType(null);
            setQuestionText("");
            setOptions([...DEFAULT_OPTIONS]);
            setCorrectAnswers([]);
            setHint("");
            setPoints("");
            setOrderIndex(String(totalQuestions + 1));
        }
        prevIsOpen.current = isOpen;
    }, [isOpen, totalQuestions]);

    // Reset form fields (not type) when type changes
    const handleSelectType = (type: QuestionType) => {
        setSelectedType(type);
        setQuestionText("");
        setOptions([...DEFAULT_OPTIONS]);
        setCorrectAnswers([]);
        setHint("");
        setPoints("");
        setOrderIndex(String(totalQuestions + 1));
    };

    const isValid =
        selectedType !== null &&
        isQuestionValid(
            selectedType,
            questionText,
            options,
            correctAnswers,
            points,
            orderIndex,
        );

    const handleConfirm = () => {
        if (!isValid || !selectedType) return;
        onConfirm({
            questionType: selectedType,
            ...buildQuestionPayload(
                selectedType,
                questionText,
                options,
                correctAnswers,
                hint,
                points,
                orderIndex,
            ),
        });
    };

    const typeSection = (() => {
        if (!selectedType) return null;
        switch (selectedType) {
            case "SHORT_ANSWER":
                return (
                    <ShortAnswerBody
                        questionText={questionText}
                        correctAnswer={correctAnswers[0] ?? ""}
                        onChange={(key, val) => {
                            if (key === "questionText") setQuestionText(val);
                            else setCorrectAnswers([val]);
                        }}
                    />
                );
            case "TRUE_FALSE":
                return (
                    <TrueFalseBody
                        questionText={questionText}
                        correctAnswer={
                            (correctAnswers[0] as "True" | "False") ?? ""
                        }
                        onChange={(key, val) => {
                            if (key === "questionText") setQuestionText(val);
                            else setCorrectAnswers([val]);
                        }}
                    />
                );
            case "MULTIPLE_CHOICE":
                return (
                    <ChoiceBody
                        questionText={questionText}
                        options={options}
                        correctAnswers={correctAnswers}
                        multiSelect={false}
                        onChangeText={setQuestionText}
                        onOptionsChange={setOptions}
                        onCorrectChange={setCorrectAnswers}
                    />
                );
            case "MULTIPLE_ANSWER":
                return (
                    <ChoiceBody
                        questionText={questionText}
                        options={options}
                        correctAnswers={correctAnswers}
                        multiSelect={true}
                        onChangeText={setQuestionText}
                        onOptionsChange={setOptions}
                        onCorrectChange={setCorrectAnswers}
                    />
                );
        }
    })();

    return (
        <AbstractModal
            isOpen={isOpen}
            title="Create Question"
            onConfirm={handleConfirm}
            onCancel={onCancel}
            isLoading={isLoading}
            confirmLabel="Create"
            confirmLoadingLabel="Creating..."
            confirmDisabled={!isValid}
        >
            <div className="flex flex-col gap-4">
                {/* Type selector */}
                <div className="flex flex-col">
                    <label className={labelCls}>Question Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {ALL_QUESTION_TYPES.map((type) => {
                            const selected = selectedType === type;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleSelectType(type)}
                                    className={`flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-colors ${
                                        selected
                                            ? `${QUESTION_TYPE_BADGE[type]} border-current`
                                            : "bg-(--discord-gray-1) border-(--discord-gray-2) text-white/60 hover:text-white hover:border-white/30"
                                    }`}
                                >
                                    <span className="text-sm font-semibold">
                                        {QUESTION_TYPE_LABELS[type]}
                                    </span>
                                    <span className="text-xs opacity-70 mt-0.5">
                                        {QUESTION_TYPE_DESCRIPTIONS[type]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Form fields — only shown once a type is selected */}
                {selectedType && (
                    <>
                        <div className="border-t border-(--discord-gray-1)" />

                        {typeSection}

                        <div className="border-t border-(--discord-gray-1)" />

                        <SharedFields
                            hint={hint}
                            points={points}
                            orderIndex={orderIndex}
                            totalQuestions={totalQuestions + 1}
                            onChange={(key, val) => {
                                if (key === "hint") setHint(val);
                                else if (key === "points") setPoints(val);
                                else setOrderIndex(val);
                            }}
                        />
                    </>
                )}
            </div>
        </AbstractModal>
    );
};

export default CreateQuizQuestionModal;
