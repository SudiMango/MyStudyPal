import React, { useEffect, useRef, useState } from "react";
import {
    SharedFields,
    ShortAnswerBody,
    TrueFalseBody,
    ChoiceBody,
    QUESTION_TYPE_LABELS,
    QUESTION_TYPE_BADGE,
    isQuestionValid,
    buildQuestionPayload,
} from "./QuizQuestionFormShared";
import {
    QuizQuestionResponse,
    UpdateQuizQuestionRequest,
} from "@/lib/dto/quiz-question-dto";
import AbstractModal from "../global/AbstractModal";

interface EditQuizQuestionModalProps {
    isOpen: boolean;
    question: QuizQuestionResponse | null;
    onConfirm: (id: string, req: UpdateQuizQuestionRequest) => void;
    onCancel: () => void;
    isLoading: boolean;
    totalQuestions: number;
}

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

    const isValid = isQuestionValid(
        type,
        questionText,
        options,
        correctAnswers,
        points,
        orderIndex,
    );

    const handleConfirm = () => {
        if (!isValid) return;
        onConfirm(
            question.questionId,
            buildQuestionPayload(
                type,
                questionText,
                options,
                correctAnswers,
                hint,
                points,
                orderIndex,
            ),
        );
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

                {typeSection}

                <div className="border-t border-(--discord-gray-1)" />

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
