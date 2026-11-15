"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProjectForm from "@/features/admin/projects/components/form/ProjectForm";
import PageHeader from "@/components/common/PageHeader";

// Import your project service and Project type

const EditProjectPage: React.FC = () => {
    const router = useRouter();
    const { projectId } = useParams<{ projectId: string }>();
    console.log("projectId", projectId);

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Replace with your actual service function
                // const data = await getProjectById(projectId);
                // setProject(data);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleSubmit = async (values: any) => {
        // Call updateProject service here

        router.push("/admin/projects");
    };

    // if (loading) {
    //     return <div>Loading project...</div>;
    // }

    // if (!project) {
    //     return <div>Project not found.</div>;
    // }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit Project"
                description="Update your portfolio project details."
            />

            <ProjectForm
                initialData={project}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
            />
        </div>
    );
};

export default EditProjectPage;