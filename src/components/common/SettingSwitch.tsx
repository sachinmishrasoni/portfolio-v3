
"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingSwitchProps {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: "sm" | "default";
    className?: string;
}

const SettingSwitch = ({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    disabled = false,
    size = "sm",
    className = "",
}: SettingSwitchProps) => {
    return (
        <div
            className={`rounded-xl border border-border p-4 ${className}`}
        >
            <div className="mb-2 flex items-center justify-between gap-3">
                <Label
                    htmlFor={id}
                    className="cursor-pointer text-sm font-medium"
                >
                    {label}
                </Label>

                <Switch
                    id={id}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                    disabled={disabled}
                    size={size}
                />
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
                {description}
            </p>
        </div>
    );
};

export default SettingSwitch;
