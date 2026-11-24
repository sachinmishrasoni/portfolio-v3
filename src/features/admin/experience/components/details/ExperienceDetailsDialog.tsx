
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
import type { Experience } from "../../experience.types";
import {
    getEmploymentTypeLabel,
    getWorkModeLabel,
} from "../../experience.utils";
import { formatDate, formatMonthYear } from "@/lib/utils/date.utils";

interface ExperienceDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    experience: Experience | null;
}

export default function ExperienceDetailsDialog({
    open,
    onOpenChange,
    experience,
}: ExperienceDetailsDialogProps) {
    if (!experience) return null;

    const {
        company,
        companyLogo,
        companyWebsite,
        designation,
        employmentType,
        workMode,
        location,
        startDate,
        endDate,
        isCurrent,
        description,
        responsibilities,
        technologies,
        isActive,
        displayOrder,
        createdAt,
        updatedAt,
    } = experience;

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
                    <DialogTitle>Experience Details</DialogTitle>
                    <DialogDescription>
                        Complete professional experience information.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Company Information */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Company Information</h3>

                        <div className="flex items-center gap-3">
                            {companyLogo ? (
                                <img
                                    src={companyLogo}
                                    alt={`${company} logo`}
                                    className="h-12 w-12 rounded-md border object-contain p-1"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-lg font-semibold">
                                    {company.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div className="min-w-0">
                                <p className="font-semibold">{company}</p>
                                <p className="text-sm text-muted-foreground">{location || "—"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {detailItem("Company Name", company)}
                            {detailItem("Company Website", companyWebsite)}
                        </div>
                    </section>

                    <Separator />

                    {/* Role Information */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Role Information</h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {detailItem("Designation", designation)}
                            {detailItem("Employment Type", getEmploymentTypeLabel(employmentType))}
                            {detailItem("Work Mode", getWorkModeLabel(workMode))}
                            {detailItem("Location", location)}
                            {detailItem("Start Date", formatMonthYear(startDate))}
                            {detailItem(
                                "End Date",
                                isCurrent ? "Present" : formatMonthYear(endDate)
                            )}
                        </div>
                    </section>

                    <Separator />

                    {/* Description */}
                    <section className="space-y-2">
                        <h3 className="text-sm font-semibold">Description</h3>
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {description || "No description available."}
                        </p>
                    </section>

                    <Separator />

                    {/* Responsibilities */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold">Responsibilities</h3>

                        {responsibilities?.length ? (
                            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                {responsibilities.map((item, index) => (
                                    <li key={`${index}-${item}`}>{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No responsibilities added.
                            </p>
                        )}
                    </section>

                    <Separator />

                    {/* Technologies */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold">Technologies</h3>

                        {technologies?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {technologies.map((technology, index) => (
                                    <Badge key={`${index}-${technology}`} variant="secondary">
                                        {technology}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No technologies added.
                            </p>
                        )}
                    </section>

                    <Separator />

                    {/* Additional Information */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Additional Information</h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={isActive ? "default" : "secondary"}>
                                    {isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            {detailItem("Display Order", displayOrder)}
                            {detailItem(
                                "Created At",
                                createdAt ? formatDate(createdAt) : "—"
                            )}
                            {detailItem(
                                "Updated At",
                                updatedAt ? formatDate(updatedAt) : "—"
                            )}
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
