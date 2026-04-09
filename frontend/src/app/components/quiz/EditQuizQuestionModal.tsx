import React, { useEffect, useRef, useState } from "react";
import AbstractModal from "../global/AbstractModal";
import {
    QuestionType,
    QuizQuestionResponse,
    UpdateQuizQuestionRequest,
} from "@/lib/dto/quiz-question-dto";

interface EditQuizQuestionModalProps {
    isOpen: boolean;
    question: QuizQuestionResponse | null;
    onConfirm: (id: string, req: UpdateQuizQuestionRequest) => void;
    onCancel: () => void;
    isLoading: boolean;
    totalQuestions: number;
}

// Shared style constants

const inputCls =
    "w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white";

const labelCls = "text-sm font-semibold mb-1 block";

// Shared bottom fields: hint + points + orderIndex

interface SharedFieldsProps {
    hint: string;
    points: string;
    orderIndex: string;
    totalQuestions: number;
    onChange: (key: "hint" | "points" | "orderIndex", val: string) => void;
}

const SharedFields: React.FC<SharedFieldsProps> = ({
    hint,
    points,
    orderIndex,
    totalQuestions,
    onChange,
}) => (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between">
                <label className={labelCls}>Hint</label>
                <span className="text-xs opacity-60">{hint.length}/100</span>
            </div>
            <input
                type="text"
                value={hint}
                maxLength={100}
                placeholder="e.g., Think about the cell biology lecture..."
                onChange={(e) => onChange("hint", e.target.value)}
                className={inputCls}
            />
        </div>

        <div className="flex flex-row gap-2">
            <div className="flex flex-col flex-1">
                <label className={labelCls}>Points</label>
                <input
                    type="number"
                    value={points}
                    min={1}
                    max={100}
                    placeholder="e.g., 10"
                    onChange={(e) => onChange("points", e.target.value)}
                    className={inputCls}
                />
            </div>
            <div className="flex flex-col flex-1">
                <label className={labelCls}>
                    Order Index (1–{totalQuestions})
                </label>
                <input
                    type="number"
                    value={orderIndex}
                    min={1}
                    max={totalQuestions}
                    placeholder={`e.g., ${totalQuestions}`}
                    onChange={(e) => onChange("orderIndex", e.target.value)}
                    className={inputCls}
                />
            </div>
        </div>
    </div>
);

// SHORT ANSWER

interface ShortAnswerBodyProps {
    questionText: string;
    correctAnswer: string;
    onChange: (key: "questionText" | "correctAnswer", val: string) => void;
}

const ShortAnswerBody: React.FC<ShortAnswerBodyProps> = ({
    questionText,
    correctAnswer,
    onChange,
}) => (
    <>
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between">
                <label className={labelCls}>Question</label>
                <span className="text-xs opacity-60">
                    {questionText.length}/300
                </span>
            </div>
            <textarea
                value={questionText}
                maxLength={300}
                rows={3}
                placeholder="e.g., What is the powerhouse of the cell?"
                onChange={(e) => onChange("questionText", e.target.value)}
                className={`${inputCls} resize-none`}
            />
        </div>

        <div className="flex flex-col">
            <div className="flex items-baseline justify-between">
                <label className={labelCls}>Correct Answer</label>
                <span className="text-xs opacity-60">
                    {correctAnswer.length}/200
                </span>
            </div>
            <input
                type="text"
                value={correctAnswer}
                maxLength={200}
                placeholder="e.g., Mitochondria"
                onChange={(e) => onChange("correctAnswer", e.target.value)}
                className={inputCls}
            />
        </div>
    </>
);

// TRUE / FALSE

interface TrueFalseBodyProps {
    questionText: string;
    correctAnswer: "True" | "False" | "";
    onChange: (key: "questionText" | "correctAnswer", val: string) => void;
}

const TrueFalseBody: React.FC<TrueFalseBodyProps> = ({
    questionText,
    correctAnswer,
    onChange,
}) => (
    <>
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between">
                <label className={labelCls}>Statement</label>
                <span className="text-xs opacity-60">
                    {questionText.length}/300
                </span>
            </div>
            <textarea
                value={questionText}
                maxLength={300}
                rows={3}
                placeholder="e.g., The mitochondria is the powerhouse of the cell."
                onChange={(e) => onChange("questionText", e.target.value)}
                className={`${inputCls} resize-none`}
            />
        </div>

        <div className="flex flex-col">
            <label className={labelCls}>Correct Answer</label>
            <div className="flex flex-row gap-2">
                {(["True", "False"] as const).map((opt) => {
                    const selected = correctAnswer === opt;
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onChange("correctAnswer", opt)}
                            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-colors border ${
                                selected
                                    ? opt === "True"
                                        ? "bg-green-600 border-green-500 text-white"
                                        : "bg-red-600 border-red-500 text-white"
                                    : "bg-(--discord-gray-1) border-(--discord-gray-2) text-white/60 hover:text-white hover:border-white/30"
                            }`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    </>
);

// OPTIONS LIST (shared by MC and MA)

interface OptionsListProps {
    options: string[];
    correctAnswers: string[];
    multiSelect: boolean;
    onOptionsChange: (opts: string[]) => void;
    onCorrectChange: (correct: string[]) => void;
}

const OptionsList: React.FC<OptionsListProps> = ({
    options,
    correctAnswers,
    multiSelect,
    onOptionsChange,
    onCorrectChange,
}) => {
    const updateOption = (i: number, val: string) => {
        const prev = options[i];
        const next = [...options];
        next[i] = val;
        onOptionsChange(next);
        // Keep correctAnswers in sync if this option was selected
        if (correctAnswers.includes(prev)) {
            onCorrectChange(correctAnswers.map((c) => (c === prev ? val : c)));
        }
    };

    const removeOption = (i: number) => {
        const removed = options[i];
        onOptionsChange(options.filter((_, idx) => idx !== i));
        onCorrectChange(correctAnswers.filter((c) => c !== removed));
    };

    const addOption = () => onOptionsChange([...options, ""]);

    const toggleCorrect = (opt: string) => {
        if (!opt.trim()) return;
        if (multiSelect) {
            onCorrectChange(
                correctAnswers.includes(opt)
                    ? correctAnswers.filter((c) => c !== opt)
                    : [...correctAnswers, opt],
            );
        } else {
            onCorrectChange([opt]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className={labelCls}>
                Options
                <span className="font-normal opacity-60 ml-2 text-xs">
                    {multiSelect
                        ? "Check all correct answers"
                        : "Select the one correct answer"}
                </span>
            </label>

            {options.map((opt, i) => {
                const isCorrect = correctAnswers.includes(opt);
                return (
                    <div key={i} className="flex flex-row items-center gap-2">
                        {/* Correct toggle: radio for MC, checkbox for MA */}
                        <button
                            type="button"
                            title={
                                multiSelect
                                    ? "Toggle correct"
                                    : "Set as correct answer"
                            }
                            onClick={() => toggleCorrect(opt)}
                            className={`flex-none w-6 h-6 transition-colors border flex items-center justify-center ${
                                multiSelect ? "rounded" : "rounded-full"
                            } ${
                                isCorrect
                                    ? "bg-green-600 border-green-500 text-white"
                                    : "bg-(--discord-gray-1) border-(--discord-gray-2) text-white/30 hover:border-white/30"
                            }`}
                        >
                            {isCorrect &&
                                (multiSelect ? (
                                    // Checkmark
                                    <svg
                                        viewBox="0 0 12 12"
                                        className="w-3 h-3"
                                        fill="none"
                                    >
                                        <path
                                            d="M2 6l3 3 5-5"
                                            stroke="white"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    // Filled dot
                                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                ))}
                        </button>

                        <input
                            type="text"
                            value={opt}
                            maxLength={200}
                            placeholder={`Option ${i + 1}`}
                            onChange={(e) => updateOption(i, e.target.value)}
                            className={`${inputCls} flex-1`}
                        />

                        {options.length > 2 && (
                            <button
                                type="button"
                                onClick={() => removeOption(i)}
                                title="Remove option"
                                className="flex-none text-white/30 hover:text-red-400 transition-colors p-1"
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    className="w-4 h-4"
                                    fill="none"
                                >
                                    <path
                                        d="M4 4l8 8M12 4l-8 8"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                );
            })}

            {options.length < 8 && (
                <button
                    type="button"
                    onClick={addOption}
                    className="mt-1 text-sm text-(--discord-blurple) hover:underline text-left"
                >
                    + Add option
                </button>
            )}
        </div>
    );
};

// MULTIPLE CHOICE

interface ChoiceBodyProps {
    questionText: string;
    options: string[];
    correctAnswers: string[];
    multiSelect: boolean;
    onChangeText: (val: string) => void;
    onOptionsChange: (opts: string[]) => void;
    onCorrectChange: (correct: string[]) => void;
}

const ChoiceBody: React.FC<ChoiceBodyProps> = ({
    questionText,
    options,
    correctAnswers,
    multiSelect,
    onChangeText,
    onOptionsChange,
    onCorrectChange,
}) => (
    <>
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between">
                <label className={labelCls}>Question</label>
                <span className="text-xs opacity-60">
                    {questionText.length}/300
                </span>
            </div>
            <textarea
                value={questionText}
                maxLength={300}
                rows={3}
                placeholder={
                    multiSelect
                        ? "e.g., Which of the following are organelles?"
                        : "e.g., Which organelle is the powerhouse of the cell?"
                }
                onChange={(e) => onChangeText(e.target.value)}
                className={`${inputCls} resize-none`}
            />
        </div>

        <OptionsList
            options={options}
            correctAnswers={correctAnswers}
            multiSelect={multiSelect}
            onOptionsChange={onOptionsChange}
            onCorrectChange={onCorrectChange}
        />
    </>
);

// Type badge config

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    SHORT_ANSWER: "Short Answer",
    TRUE_FALSE: "True / False",
    MULTIPLE_CHOICE: "Multiple Choice",
    MULTIPLE_ANSWER: "Multiple Answer",
};

const QUESTION_TYPE_BADGE: Record<QuestionType, string> = {
    SHORT_ANSWER: "bg-blue-600/20 text-blue-300 border-blue-600/30",
    TRUE_FALSE: "bg-purple-600/20 text-purple-300 border-purple-600/30",
    MULTIPLE_CHOICE: "bg-yellow-600/20 text-yellow-300 border-yellow-600/30",
    MULTIPLE_ANSWER: "bg-green-600/20 text-green-300 border-green-600/30",
};

// Main modal

const EditQuizQuestionModal: React.FC<EditQuizQuestionModalProps> = ({
    isOpen,
    question,
    onConfirm,
    onCancel,
    isLoading,
    totalQuestions,
}) => {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [hint, setHint] = useState("");
    const [points, setPoints] = useState("");
    const [orderIndex, setOrderIndex] = useState("");

    const prevIsOpen = useRef(false);

    useEffect(() => {
        if (isOpen && !prevIsOpen.current && question) {
            setQuestionText(question.questionText);
            setOptions([...question.options]);
            setCorrectAnswers([...question.correctAnswers]);
            setHint(question.hint ?? "");
            setPoints(String(question.points));
            setOrderIndex(String(question.orderIndex));
        }
        prevIsOpen.current = isOpen;
    }, [isOpen, question]);

    if (!question) return null;

    const type = question.questionType;

    const isValid = (() => {
        if (!questionText.trim()) return false;
        if (!points || Number(points) < 1) return false;
        if (!orderIndex || Number(orderIndex) < 1) return false;
        if (type === "SHORT_ANSWER")
            return (correctAnswers[0] ?? "").trim().length > 0;
        if (type === "TRUE_FALSE")
            return (
                correctAnswers[0] === "True" || correctAnswers[0] === "False"
            );
        if (type === "MULTIPLE_CHOICE")
            return (
                options.length >= 2 &&
                options.every((o) => o.trim()) &&
                correctAnswers.length === 1 &&
                options.includes(correctAnswers[0])
            );
        if (type === "MULTIPLE_ANSWER")
            return (
                options.length >= 2 &&
                options.every((o) => o.trim()) &&
                correctAnswers.length >= 1 &&
                correctAnswers.every((c) => options.includes(c))
            );
        return false;
    })();

    const handleConfirm = () => {
        if (!isValid) return;
        const req: UpdateQuizQuestionRequest = {
            questionText: questionText.trim(),
            hint: hint.trim() || undefined,
            points: Number(points),
            orderIndex: Number(orderIndex),
            ...(type !== "SHORT_ANSWER" && type !== "TRUE_FALSE"
                ? { options }
                : {}),
            correctAnswers,
        };
        onConfirm(question.questionId, req);
    };

    const typeSection = (() => {
        switch (type) {
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
            title="Edit Question"
            onConfirm={handleConfirm}
            onCancel={onCancel}
            isLoading={isLoading}
            confirmLabel="Save Changes"
            confirmLoadingLabel="Saving..."
            confirmDisabled={!isValid}
        >
            <div className="flex flex-col gap-4">
                {/* Read-only type badge */}
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded border ${QUESTION_TYPE_BADGE[type]}`}
                    >
                        {QUESTION_TYPE_LABELS[type]}
                    </span>
                    <span className="text-xs text-white/40">
                        Question type cannot be changed
                    </span>
                </div>

                <div className="border-t border-(--discord-gray-1)" />

                {/* Type-specific section */}
                {typeSection}

                <div className="border-t border-(--discord-gray-1)" />

                {/* Shared: hint, points, orderIndex */}
                <SharedFields
                    hint={hint}
                    points={points}
                    orderIndex={orderIndex}
                    totalQuestions={totalQuestions}
                    onChange={(key, val) => {
                        if (key === "hint") setHint(val);
                        else if (key === "points") setPoints(val);
                        else setOrderIndex(val);
                    }}
                />
            </div>
        </AbstractModal>
    );
};

export default EditQuizQuestionModal;
