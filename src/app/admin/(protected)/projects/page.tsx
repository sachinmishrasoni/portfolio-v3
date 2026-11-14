"use client";
import ProjectTable from '@/features/admin/projects/components/ProjectTable'
import { useProjects } from '@/features/admin/projects/useProjects';

export default function Projects() {
  const {data: projects = [], isLoading, isError, refetch} = useProjects();
  console.log("projects", projects);
  return (
    <div>
      <ProjectTable  projects={projects} />
    </div>
  )
};
