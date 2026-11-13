"use client";

import React from "react";
import ProjectForm from "@/features/admin/projects/components/ProjectForm";
import Paper from "@/components/common/Paper";
import PageHeader from "@/components/common/PageHeader";
import { useRouter } from "next/navigation";

const CreateProjectPage: React.FC = () => {
    const router = useRouter();

    const handleSubmit = async (values: any) => {
        // Call createProject service here

        router.push("/admin/projects");
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Add New Project"
                description="Create and manage your portfolio project details."
            />

            <Paper className="p-5">
                <ProjectForm
                    onSubmit={handleSubmit}
                    onCancel={() => router.back()}
                />
            </Paper>
        </div>
    );
};

export default CreateProjectPage;
