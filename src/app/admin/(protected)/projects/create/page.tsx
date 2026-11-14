"use client";

import React from "react";
import ProjectForm from "@/features/admin/projects/components/form/ProjectForm";
import Paper from "@/components/common/Paper";
import PageHeader from "@/components/common/PageHeader";
import { useRouter } from "next/navigation";
import { createProject } from "@/features/admin/projects/projects.service";
import { toast } from "sonner";

const CreateProjectPage: React.FC = () => {
    const router = useRouter();

    const handleSubmit = async (values: any) => {
        try {
            // Call createProject service here
            await createProject(values);
            toast.success("Project created successfully");
            // router.push("/admin/projects");
        } catch (error) {
            toast.error(error as string);
            console.error("Error creating project:", error);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Add New Project"
                description="Create and manage your portfolio project details."
            />

            {/* <Paper className="p-5"> */}
                <ProjectForm
                    onSubmit={handleSubmit}
                    onCancel={() => router.back()}
                />
            {/* </Paper> */}
        </div>
    );
};

export default CreateProjectPage;
