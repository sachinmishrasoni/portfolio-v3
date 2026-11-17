
import type { Project } from "../../projects.types";
import type { ProjectFormInput } from "../../project.schema";

const parseDate = (value?: string) => {
    if (!value) return undefined;

    const [year, month, day] = value.split("-").map(Number);

    return new Date(year, month - 1, day);
};

// export const mapProjectToForm = (
//     project: Project
// ): ProjectFormInput => ({
//     title: project.title,
//     slug: project.slug,
//     overview: project.overview,
//     description: project.description,
//     category: project.category,
//     projectType: project.projectType,
//     status: project.status,

//     thumbnailUrl: project.thumbnail?.url ?? "",
//     imageUrls: project.images?.map((image) => image.url).join("\n") ?? "",

//     technologies: project.technologies ?? [],
//     features: project.features ?? [],
//     role: project.role ?? "",
//     challenges: project.challenges ?? "",
//     solution: project.solution ?? "",

//     startDate: parseDate(project.startDate),
//     endDate: parseDate(project.endDate),

//     liveUrl: project.liveUrl ?? "",
//     githubUrl: project.githubUrl ?? "",

//     featured: project.featured,
//     published: project.published,
//     displayOrder: project.displayOrder,

//     metaTitle: project.seo?.metaTitle ?? "",
//     metaDescription: project.seo?.metaDescription ?? "",
// });

export const mapProjectToForm = (
    project: Project
): ProjectFormInput => ({
    title: project.title,
    slug: project.slug,
    overview: project.overview,
    description: project.description,
    category: project.category,
    projectType: project.projectType,
    status: project.status,

    // Project media
    mediaMode: project.mediaMode,
    thumbnail: project.thumbnail,
    images: project.images,

    // Project details
    technologies: project.technologies,
    features: project.features ?? [],
    role: project.role ?? "",
    challenges: project.challenges ?? "",
    solution: project.solution ?? "",

    // Project timeline
    startDate: new Date(project.startDate),
    endDate: project.endDate
        ? new Date(project.endDate)
        : undefined,

    // Project links
    liveUrl: project.liveUrl ?? "",
    githubUrl: project.githubUrl ?? "",

    // Publishing settings
    featured: project.featured,
    published: project.published,
    displayOrder: project.displayOrder,

    // SEO settings
    metaTitle: project.seo?.metaTitle ?? "",
    metaDescription: project.seo?.metaDescription ?? "",
});
