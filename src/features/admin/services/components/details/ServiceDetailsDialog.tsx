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
import type { Service } from "../../services.types";
import { formatDate } from "@/lib/utils/date.utils";

interface ServiceDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    service: Service | null;
}

export default function ServiceDetailsDialog({
    open,
    onOpenChange,
    service,
}: ServiceDetailsDialogProps) {
    if (!service) return null;

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
                    <DialogTitle>Service Details</DialogTitle>
                    <DialogDescription>
                        Complete service information.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Service Information</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-muted">
                                {service.icon ? (
                                    <Icon icon={service.icon} width={28} height={28} />
                                ) : (
                                    <span className="font-semibold">
                                        {service.title.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold">{service.title}</p>
                                <p className="text-sm text-muted-foreground">{service.tagline}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {detailItem("Title", service.title)}
                            {detailItem("Slug", service.slug)}
                            {detailItem("Icon", service.icon)}
                            {detailItem("Image", service.image)}
                        </div>
                    </section>

                    <Separator />

                    <section className="space-y-2">
                        <h3 className="text-sm font-semibold">Description</h3>
                        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                            {service.description || "No description available."}
                        </p>
                    </section>

                    <Separator />

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold">Features</h3>
                        {service.features?.length ? (
                            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                {service.features.map((feature, index) => (
                                    <li key={`${index}-${feature}`}>{feature}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No features added.</p>
                        )}
                    </section>

                    <Separator />

                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold">Technologies</h3>
                        {service.technologies?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {service.technologies.map((technology, index) => (
                                    <Badge key={`${index}-${technology}`} variant="secondary">
                                        {technology}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No technologies added.</p>
                        )}
                    </section>

                    <Separator />

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Additional Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={service.isActive ? "default" : "secondary"}>
                                    {service.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            {detailItem("Featured", service.isFeatured ? "Yes" : "No")}
                            {detailItem("Display Order", service.displayOrder)}
                            {detailItem("Created At", service.createdAt ? formatDate(service.createdAt) : "—")}
                            {detailItem("Updated At", service.updatedAt ? formatDate(service.updatedAt) : "—")}
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
