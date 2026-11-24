"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Education } from "../../education.types";
import { getEducationLevelLabel } from "../../education.utils";
import { formatDate, formatMonthYear } from "@/lib/utils/date.utils";

interface EducationDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    education: Education | null;
}

export default function EducationDetailsDialog({
    open,
    onOpenChange,
    education,
}: EducationDetailsDialogProps) {
    if (!education) return null;

    const detailItem = (label: string, value?: string | number | null) => (
        <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-sm font-medium break-words">{value || "—"}</p>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Education Details</DialogTitle>
                    <DialogDescription>
                        Complete education information.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Institution Information</h3>
                        <div className="flex items-center gap-3">
                            {education.institutionLogo ? (
                                <img src={education.institutionLogo} alt={`${education.institution} logo`}
                                    className="h-12 w-12 rounded-md border object-contain p-1" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-lg font-semibold">
                                    {education.institution.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="font-semibold">{education.institution}</p>
                                <p className="text-sm text-muted-foreground">{education.location || "—"}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {detailItem("Institution Name", education.institution)}
                            {detailItem("Institution Website", education.institutionWebsite)}
                        </div>
                    </section>

                    <Separator />

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Education Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {detailItem("Education Level", getEducationLevelLabel(education.educationLevel))}
                            {detailItem("Degree", education.degree)}
                            {detailItem("Field of Study", education.fieldOfStudy)}
                            {detailItem("Grade", education.grade)}
                            {detailItem("Location", education.location)}
                            {detailItem("Start Date", formatMonthYear(education.startDate))}
                            {detailItem("End Date", education.isCurrent ? "Present" : formatMonthYear(education.endDate))}
                        </div>
                    </section>

                    <Separator />

                    <section className="space-y-2">
                        <h3 className="text-sm font-semibold">Description</h3>
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {education.description || "No description available."}
                        </p>
                    </section>

                    <Separator />

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold">Achievements</h3>
                        {education.achievements?.length ? (
                            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                {education.achievements.map((achievement, index) => (
                                    <li key={`${index}-${achievement}`}>{achievement}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No achievements added.</p>
                        )}
                    </section>

                    <Separator />

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Additional Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={education.isActive ? "default" : "secondary"}>
                                    {education.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            {detailItem("Display Order", education.displayOrder)}
                            {detailItem("Created At", education.createdAt ? formatDate(education.createdAt) : "—")}
                            {detailItem("Updated At", education.updatedAt ? formatDate(education.updatedAt) : "—")}
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
