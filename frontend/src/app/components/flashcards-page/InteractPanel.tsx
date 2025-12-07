import {
    Brain,
    ChartNoAxesCombined,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import React, { useState } from "react";

const InteractPanel = () => {
    const [showInteract, setShowInteract] = useState<boolean>(true);

    return (
        <div className="bg-(--discord-gray-3) w-full rounded-xl shadow-lg p-5 my-5 outline outline-(--discord-blurple) flex flex-col">
            <div className="flex flex-row">
                <label className="font-bold text-lg mr-auto">Interact</label>
                <button onClick={() => setShowInteract(!showInteract)}>
                    {showInteract ? (
                        <ChevronUp className="h-7 w-7 hover:text-(--discord-blurple)" />
                    ) : (
                        <ChevronDown className="h-7 w-7 hover:text-(--discord-blurple)" />
                    )}
                </button>
            </div>
            <div
                hidden={!showInteract}
                className="w-full h-0.5 bg-(--discord-gray-2) my-5"
            />
            {showInteract && (
                <div className="flex flex-col justify-center items-center w-full space-y-3">
                    <div className="flex flex-row justify-center items-center w-full space-x-3">
                        <button className="w-1/2 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2)">
                            <Brain />
                            <label>Quiz</label>
                        </button>
                        <button className="w-1/2 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:outline-(--discord-gray-2)">
                            <ChartNoAxesCombined />
                            <label>Stats</label>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteractPanel;
