import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "@/features/admin/projects/types/project.types";

import { Timestamp } from "firebase/firestore";

const PROJECTS_COLLECTION = "projects";

const projectsCollection = collection(db, PROJECTS_COLLECTION);

// Convert Firestore timestamps into serializable ISO strings.
function toISOString(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

// Convert a Firestore document into our Project model.
function mapProject(
  id: string,
  data: Record<string, unknown>
): Project {
  return {
    id,
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),

    shortDescription: String(data.shortDescription ?? ""),
    description: String(data.description ?? ""),

    thumbnail: String(data.thumbnail ?? ""),
    images: Array.isArray(data.images)
      ? (data.images as string[])
      : [],

    technologies: Array.isArray(data.technologies)
      ? (data.technologies as string[])
      : [],

    category: String(data.category ?? ""),

    liveUrl:
      typeof data.liveUrl === "string" ? data.liveUrl : undefined,

    githubUrl:
      typeof data.githubUrl === "string" ? data.githubUrl : undefined,

    featured: Boolean(data.featured),
    published: Boolean(data.published),

    displayOrder: Number(data.displayOrder ?? 0),

    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  };
}

// Remove undefined properties before sending data to Firestore.
function removeUndefinedFields<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

/**
 * CREATE PROJECT
 */
export async function createProject(
  input: CreateProjectInput
): Promise<string> {
  const projectData = removeUndefinedFields(input);

  const docRef = await addDoc(projectsCollection, {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * GET ALL PROJECTS (ADMIN)
 */
export async function getAllProjects(): Promise<Project[]> {
  const projectsQuery = query(
    projectsCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(projectsQuery);

  return snapshot.docs.map((projectDoc) =>
    mapProject(projectDoc.id, projectDoc.data())
  );
}

/**
 * GET PROJECT BY ID
 */
export async function getProjectById(
  projectId: string
): Promise<Project | null> {
  const projectRef = doc(db, PROJECTS_COLLECTION, projectId);

  const snapshot = await getDoc(projectRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapProject(snapshot.id, snapshot.data());
}

/**
 * UPDATE PROJECT
 */
export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<void> {
  const projectRef = doc(db, PROJECTS_COLLECTION, projectId);

  const projectData = removeUndefinedFields(input);

  await updateDoc(projectRef, {
    ...projectData,
    updatedAt: serverTimestamp(),
  });
}

/**
 * DELETE PROJECT
 */
export async function deleteProject(
  projectId: string
): Promise<void> {
  const projectRef = doc(db, PROJECTS_COLLECTION, projectId);

  await deleteDoc(projectRef);
}

/**
 * GET PUBLISHED PROJECTS (PUBLIC PORTFOLIO)
 */
export async function getPublishedProjects(): Promise<Project[]> {
  const publishedQuery = query(
    projectsCollection,
    where("published", "==", true),
    orderBy("displayOrder", "asc")
  );

  const snapshot = await getDocs(publishedQuery);

  return snapshot.docs.map((projectDoc) =>
    mapProject(projectDoc.id, projectDoc.data())
  );
}

/**
 * GET FEATURED PROJECTS (PUBLIC PORTFOLIO)
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const featuredQuery = query(
    projectsCollection,
    where("published", "==", true),
    where("featured", "==", true),
    orderBy("displayOrder", "asc")
  );

  const snapshot = await getDocs(featuredQuery);

  return snapshot.docs.map((projectDoc) =>
    mapProject(projectDoc.id, projectDoc.data())
  );
}