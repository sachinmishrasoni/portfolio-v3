
"use client";

import { Icon } from "@iconify/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { Skill } from "../../skill.types";
import { getCategoryLabel } from "../../skill.utils";
import { formatDate } from "@/lib/utils/date.utils";

interface SkillDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    skill: Skill | null;
}

const SkillDetailsDialog = ({
    open,
    onOpenChange,
    skill,
}: SkillDetailsDialogProps) => {
    if (!skill) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Skill Details</DialogTitle>
                    <DialogDescription>
                        View complete information about this skill.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    {/* Skill Information */}
                    <div className="flex items-center gap-4 rounded-xl border border-border p-3">
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                            <Icon
                                icon={skill.icon}
                                width={36}
                                height={36}
                                color={skill.color || "currentColor"}
                            />
                        </div>

                        <div className="min-w-0 flex-1 space-y-0">
                            <h3 className="text-lg font-semibold leading-relaxed">
                                {skill.name}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                {getCategoryLabel(skill.category)}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                {skill.icon}
                            </p>
                        </div>

                        <Badge variant={skill.isActive ? "default" : "secondary"}>
                            {skill.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Description</h4>

                        <p className="text-sm leading-6 text-muted-foreground">
                            {skill.description || "No description available."}
                        </p>
                    </div>

                    <Separator />

                    {/* Proficiency */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">
                                Proficiency
                            </h4>

                            <span className="text-sm font-semibold tabular-nums">
                                {skill.proficiency}%
                            </span>
                        </div>

                        <div
                            className="h-2 overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-valuenow={skill.proficiency}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Skill proficiency"
                        >
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                    width: `${skill.proficiency}%`,
                                }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Expert</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Additional Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                                Display Order
                            </p>
                            <p className="text-sm font-medium">
                                {skill.displayOrder}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                                Icon Color
                            </p>

                            <div className="flex items-center gap-2">
                                <span
                                    className="size-4 rounded-full border"
                                    style={{
                                        backgroundColor: skill.color || "transparent",
                                    }}
                                />
                                <span className="text-sm font-medium">
                                    {skill.color || "Default"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                                Created At
                            </p>
                            <p className="text-sm font-medium">
                                {formatDate(skill.createdAt)}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                                Last Updated
                            </p>
                            <p className="text-sm font-medium">
                                {formatDate(skill.updatedAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SkillDetailsDialog;
