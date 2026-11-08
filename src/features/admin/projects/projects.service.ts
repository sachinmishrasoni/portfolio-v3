import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { Project } from "./projects.types";

const COLLECTION_NAME = "projects";
const projectsCollection = collection(db, COLLECTION_NAME);

// Convert Firestore document into Project
const mapProject = (id: string, data: Record<string, unknown>): Project => ({
    ...(data as Omit<Project, "id" | "createdAt" | "updatedAt">),
    id,
    createdAt:
        data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : undefined,
    updatedAt:
        data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate()
            : undefined,
});

// CREATE PROJECT
export const createProject = async (projectData: Project) => {
    try {
        const docRef = await addDoc(projectsCollection, {
            ...projectData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};