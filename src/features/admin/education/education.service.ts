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
    CreateEducationInput,
    Education,
    UpdateEducationInput,
} from "./education.types";

const COLLECTION_NAME = "educations";
const educationCollection = collection(db, COLLECTION_NAME);

const mapEducationDates = (
    data: Record<string, unknown>
): Omit<Education, "id"> => ({
    ...(data as Omit<Education, "id">),
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

export const createEducation = async (
    payload: CreateEducationInput
): Promise<string> => {
    const docRef = await addDoc(educationCollection, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

export const getEducations = async (): Promise<Education[]> => {
    const educationQuery = query(
        educationCollection,
        orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(educationQuery);
    return snapshot.docs.map((educationDoc) => ({
        id: educationDoc.id,
        ...mapEducationDates(educationDoc.data()),
    }));
};

export const getActiveEducations = async (): Promise<Education[]> => {
    const educationQuery = query(
        educationCollection,
        where("isActive", "==", true),
        orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(educationQuery);
    return snapshot.docs.map((educationDoc) => ({
        id: educationDoc.id,
        ...mapEducationDates(educationDoc.data()),
    }));
};

export const getEducationById = async (
    educationId: string
): Promise<Education | null> => {
    const docRef = doc(db, COLLECTION_NAME, educationId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return {
        id: snapshot.id,
        ...mapEducationDates(snapshot.data()),
    };
};

export const updateEducation = async (
    educationId: string,
    payload: UpdateEducationInput
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, educationId);
    await updateDoc(docRef, {
        ...payload,
        updatedAt: serverTimestamp(),
    });
};

export const deleteEducation = async (
    educationId: string
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, educationId);
    await deleteDoc(docRef);
};
