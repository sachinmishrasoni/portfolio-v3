
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
    where,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";

import type {
    CreateExperienceInput,
    Experience,
    UpdateExperienceInput,
} from "./experience.types";

const COLLECTION_NAME = "experiences";

const experienceCollection = collection(db, COLLECTION_NAME);

// Convert Firestore Timestamp values to JavaScript Date values.
const mapExperienceDates = (
    data: Record<string, unknown>
): Omit<Experience, "id"> => ({
    ...(data as Omit<Experience, "id">),
    startDate:
        data.startDate instanceof Timestamp
            ? data.startDate.toDate()
            : (data.startDate as Date),
    endDate:
        data.endDate instanceof Timestamp
            ? data.endDate.toDate()
            : (data.endDate as Date | null),
    createdAt:
        data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : undefined,
    updatedAt:
        data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate()
            : undefined,
});

// Create Experience
export const createExperience = async (
    payload: CreateExperienceInput
): Promise<string> => {
    try {
        const docRef = await addDoc(experienceCollection, {
            ...payload,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return docRef.id;
    } catch (error) {
        console.error("Error creating experience:", error);
        throw error;
    }
};

// Get All Experiences
export const getExperiences = async (): Promise<Experience[]> => {
    try {
        const experienceQuery = query(
            experienceCollection,
            orderBy("displayOrder", "asc")
        );

        const snapshot = await getDocs(experienceQuery);

        return snapshot.docs.map((experienceDoc) => ({
            id: experienceDoc.id,
            ...mapExperienceDates(experienceDoc.data()),
        }));
    } catch (error) {
        console.error("Error fetching experiences:", error);
        throw error;
    }
};

// Get Active Experiences
export const getActiveExperiences = async (): Promise<Experience[]> => {
    try {
        const experienceQuery = query(
            experienceCollection,
            where("isActive", "==", true),
            orderBy("displayOrder", "asc")
        );

        const snapshot = await getDocs(experienceQuery);

        return snapshot.docs.map((experienceDoc) => ({
            id: experienceDoc.id,
            ...mapExperienceDates(experienceDoc.data()),
        }));
    } catch (error) {
        console.error("Error fetching active experiences:", error);
        throw error;
    }
};

// Get Experience By ID
export const getExperienceById = async (
    experienceId: string
): Promise<Experience | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, experienceId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return null;
        }

        return {
            id: snapshot.id,
            ...mapExperienceDates(snapshot.data()),
        };
    } catch (error) {
        console.error("Error fetching experience:", error);
        throw error;
    }
};

// Update Experience
export const updateExperience = async (
    experienceId: string,
    payload: UpdateExperienceInput
): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, experienceId);

        await updateDoc(docRef, {
            ...payload,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating experience:", error);
        throw error;
    }
};

// Delete Experience
export const deleteExperience = async (
    experienceId: string
): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, experienceId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting experience:", error);
        throw error;
    }
};
