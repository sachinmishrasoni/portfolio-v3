
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FiImage, FiLink } from "react-icons/fi";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import type { ProjectFormInput } from "../../../../project.schema";

import ProjectFormSection from "../../ProjectFormSection";
import ProjectImageUpload from "./ProjectImageUpload";
import ProjectImageUrls from "./ProjectImageUrls";

const ProjectMediaSection = () => {
    const { setValue } = useFormContext<ProjectFormInput>();

    const [mediaMode, setMediaMode] = useState<"image" | "url">("image");

    const handleMediaModeChange = (value: string) => {
        if (value !== "image" && value !== "url") return;

        setMediaMode(value);

        setValue("mediaMode", value, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <ProjectFormSection
            icon={FiImage}
            title="Project Media"
            description="Upload project images and thumbnail."
        >
            <Tabs
                value={mediaMode}
                onValueChange={handleMediaModeChange}
                className="w-full"
            >
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

                {/* Image Upload */}
                <TabsContent value="image" className="pt-2">
                    <ProjectImageUpload />
                </TabsContent>

                {/* Image URLs */}
                <TabsContent value="url" className="pt-2">
                    <ProjectImageUrls />
                </TabsContent>
            </Tabs>
        </ProjectFormSection>
    );
};

export default ProjectMediaSection;
