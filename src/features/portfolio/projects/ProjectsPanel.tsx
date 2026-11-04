'use client';

import React from 'react';
import FeaturedProject from './FeaturedProject';
import ProjectCard from './ProjectCard';
import type { ProjectGroup } from './projects.data';

/** One tab's content: the featured hero card, then the grid of the remaining projects. */
const ProjectsPanel: React.FC<{ group: ProjectGroup }> = ({ group }) => (
    <div className="space-y-6">
        <FeaturedProject project={group.featured} />

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {group.items.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
            ))}
        </ul>
    </div>
);

export default ProjectsPanel;
