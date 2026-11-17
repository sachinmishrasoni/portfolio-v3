
export type ProjectMediaMode = "image" | "url";

export type ProjectImage =
  | {
      url: string;
      source: "cloudinary";
      publicId: string;
      assetId?: string;
    }
  | {
      url: string;
      source: "external";
    };

export type ProjectStatus = "completed" | "in-progress" | "on-hold" | "archived";

export type ProjectType = "professional" | "personal";

export interface ProjectSEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface Project {
  // Identity
  id: string;
  projectId: string;
  slug: string;

  // Basic Information
  title: string;
  overview: string;
  description: string;
  category: string;
  projectType: ProjectType;

  // Media
  mediaMode: ProjectMediaMode;
  thumbnail: ProjectImage;
  images: ProjectImage[];

  // Technical Information
  technologies: string[];
  features?: string[];
  challenges?: string;
  solution?: string;

  // Contribution
  role?: string;

  // Timeline
  startDate: string;
  endDate?: string;

  // Links
  liveUrl?: string;
  githubUrl?: string;

  // Publishing
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  displayOrder: number;

  // SEO
  seo?: ProjectSEO;

  // System Fields
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectInput = Omit<
  Project,
  "id" | "projectId" | "createdAt" | "updatedAt"
>;

export type CloudinaryProjectImage = Extract<
  ProjectImage,
  { source: "cloudinary" }
>;

export type ExternalProjectImage = Extract<
  ProjectImage,
  { source: "external" }
>;
