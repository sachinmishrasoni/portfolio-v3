import { db } from "@/lib/firebase";
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
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { Project } from "./projects.types";

const COLLECTION_NAME = "projects";
const projectsCollection = collection(db, COLLECTION_NAME);

// Fields managed by Firestore / the service, never supplied by callers
export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;

// Convert Firestore timestamps into serializable ISO strings.
function toISOString(value: unknown): string | undefined {
    if (value instanceof Timestamp) return value.toDate().toISOString();
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    return undefined; // e.g. pending serverTimestamp
}

// Convert Firestore timestamps into Date objects
function toDate(value: unknown): Date | undefined {
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;

    if (typeof value === "string") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date;
    }

    return undefined;
}

// Remove undefined values, which Firestore rejects
function stripUndefined<T extends object>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
    ) as T;
}

// Convert Firestore document into Project
const mapProject = (id: string, data: Record<string, unknown>): Project => ({
    ...(data as ProjectInput),
    id,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
});

// CREATE PROJECT
export const createProject = async (projectData: ProjectInput) => {
    try {
        const docRef = await addDoc(projectsCollection, {
            ...stripUndefined(projectData),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

// GET ALL PROJECTS
export const getProjects = async () => {
    try {
        const q = query(projectsCollection, orderBy("displayOrder", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => mapProject(d.id, d.data()));
    } catch (error) {
        console.error("Error getting projects:", error);
        throw error;
    }
};

// GET PROJECT BY ID
export const getProjectById = async (projectId: string) => {
    try {
        const snapshot = await getDoc(doc(db, COLLECTION_NAME, projectId));
        return snapshot.exists() ? mapProject(snapshot.id, snapshot.data()) : null;
    } catch (error) {
        console.error("Error getting project:", error);
        throw error;
    }
};

// UPDATE PROJECT (partial updates allowed; createdAt is never touched)
export const updateProject = async (
    projectId: string,
    projectData: Partial<ProjectInput>
) => {
    try {
        await updateDoc(doc(db, COLLECTION_NAME, projectId), {
            ...stripUndefined(projectData),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
};

// DELETE PROJECT
export const deleteProject = async (projectId: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, projectId));
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};
