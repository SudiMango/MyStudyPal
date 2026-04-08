import React, { ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";

interface CardAction {
    label: string;
    icon: ReactNode;
    onClick: () => void;
}

interface ItemDisplayCardProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    stats: ReactNode[];
    actions: CardAction[];
    onCardClick: () => void;
    onMenuClick: (e: React.MouseEvent) => void;
    dropdownComponent?: ReactNode;
    dropdownRef?: React.RefObject<HTMLDivElement | null> | null;
}

const ItemDisplayCard = ({
    title,
    subtitle,
    icon,
    stats,
    actions,
    onCardClick,
    onMenuClick,
    dropdownComponent,
    dropdownRef,
}: ItemDisplayCardProps) => {
    return (
        <div
            className="flex flex-col items-start justify-center w-full shadow-xl rounded-xl bg-(--discord-gray-4) p-4 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
            onClick={onCardClick}
        >
            {/* Header */}
            <div className="flex flex-row items-center justify-center space-x-3 w-full">
                <label className="text-4xl">{icon}</label>
                <div className="flex flex-col">
                    <label className="text-md font-semibold cursor-pointer">
                        {title}
                    </label>
                    <label className="text-sm opacity-70">{subtitle}</label>
                </div>

                <div
                    className="relative flex justify-center items-center ml-auto"
                    ref={dropdownRef}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMenuClick(e);
                        }}
                        className="hover:text-(--discord-blurple)"
                    >
                        <EllipsisVertical className="w-5 h-5 opacity-80 mb-1" />
                    </button>
                    {dropdownComponent}
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 flex flex-row flex-wrap gap-3">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-(--discord-gray-2) py-1 px-2 rounded-lg flex items-center justify-center"
                    >
                        <span className="text-sm flex items-center leading-none">
                            {stat}
                        </span>
                    </div>
                ))}
            </div>

            <div className="h-0.5 w-full bg-(--discord-gray-1) my-5 rounded-2xl"></div>

            {/* Actions */}
            <div className="flex flex-row space-x-3 w-full">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                        }}
                        className="flex-1 bg-(--discord-gray-1) flex flex-row justify-center items-center space-x-3 p-3 rounded-lg outline outline-(--discord-blurple) hover:bg-(--discord-gray-2) cursor-pointer"
                    >
                        <span>{action.icon}</span>
                        <span className="hidden sm:inline">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ItemDisplayCard;
