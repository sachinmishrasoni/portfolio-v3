"use client";
import ProjectList from '@/features/admin/projects/components/list';
import { useProjects } from '@/features/admin/projects/hooks/projects.queries';

export default function Projects() {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects();
  // console.log("projects", projects, isLoading);

  return (
    <ProjectList
      projects={projects}
      loading={isLoading}
    />
  )
};
