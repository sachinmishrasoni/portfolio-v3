"use client";
import ProjectList from '@/features/admin/projects/components/list';
import { useProjects } from '@/features/admin/projects/useProjects';

export default function Projects() {
  const { data: projects = [], isLoading, isError, refetch } = useProjects();
  // console.log("projects", projects);
  return (
    <ProjectList
      projects={projects}
      loading={isLoading}
    />
  )
};
