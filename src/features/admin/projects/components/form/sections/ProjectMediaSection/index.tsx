
"use client";

import { useFormContext } from "react-hook-form";
import { FiImage, FiLink } from "react-icons/fi";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectFormInput } from "../../../../project.schema";

import ProjectFormSection from "../../ProjectFormSection";
import ProjectImageUpload from "./ProjectImageUpload";
import ProjectImageUrls from "./ProjectImageUrls";

const ProjectMediaSection = () => {
    const { watch, setValue } = useFormContext<ProjectFormInput>();
    const mediaMode = watch("mediaMode") ?? "image";

    const handleMediaModeChange = (value: string) => {
        if (value !== "image" && value !== "url") return;
        if (value === mediaMode) return;

        setValue("mediaMode", value, { shouldDirty: true, shouldValidate: true });
        setValue("thumbnail", null, { shouldDirty: true, shouldValidate: true });
        setValue("images", [], { shouldDirty: true, shouldValidate: true });
    };

    return (
        <ProjectFormSection icon={FiImage} title="Project Media" description="Upload project images or provide external image URLs.">
            <Tabs value={mediaMode} onValueChange={handleMediaModeChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="image" className="gap-2">
                        <FiImage size={15} />
                        Image Upload
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2">
                        <FiLink size={15} />
                        Image URLs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="image" className="pt-2">
                    <ProjectImageUpload />
                </TabsContent>

                <TabsContent value="url" className="pt-2">
                    <ProjectImageUrls />
                </TabsContent>
            </Tabs>
        </ProjectFormSection>
    );
};

export default ProjectMediaSection;
