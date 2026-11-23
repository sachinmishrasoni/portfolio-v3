"use client";

import { Icon } from "@iconify/react";

interface DynamicIconProps {
    name: string;
    size?: number;
    color?: string;
}

const DynamicIcon = ({
    name,
    size = 24,
    color,
}: DynamicIconProps) => {
    return (
        <Icon
            icon={name}
            width={size}
            height={size}
            color={color}
        />
    );
};

export default DynamicIcon;