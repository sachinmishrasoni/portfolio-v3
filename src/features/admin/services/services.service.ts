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
    CreateServiceInput,
    Service,
    UpdateServiceInput,
} from "./services.types";

const COLLECTION_NAME = "services";
const servicesCollection = collection(db, COLLECTION_NAME);

const mapService = (
    id: string,
    data: Record<string, unknown>
): Service => ({
    ...(data as Omit<Service, "id" | "createdAt" | "updatedAt">),
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

export const createService = async (
    payload: CreateServiceInput
): Promise<string> => {
    const docRef = await addDoc(servicesCollection, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
};

export const getServices = async (): Promise<Service[]> => {
    const serviceQuery = query(
        servicesCollection,
        orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(serviceQuery);
    return snapshot.docs.map((serviceDoc) =>
        mapService(serviceDoc.id, serviceDoc.data())
    );
};

export const getActiveServices = async (): Promise<Service[]> => {
    const serviceQuery = query(
        servicesCollection,
        where("isActive", "==", true),
        orderBy("displayOrder", "asc")
    );
    const snapshot = await getDocs(serviceQuery);
    return snapshot.docs.map((serviceDoc) =>
        mapService(serviceDoc.id, serviceDoc.data())
    );
};

export const getServiceById = async (
    serviceId: string
): Promise<Service | null> => {
    const docRef = doc(db, COLLECTION_NAME, serviceId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return mapService(snapshot.id, snapshot.data());
};

export const updateService = async (
    serviceId: string,
    payload: UpdateServiceInput
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, serviceId);
    await updateDoc(docRef, {
        ...payload,
        updatedAt: serverTimestamp(),
    });
};

export const deleteService = async (
    serviceId: string
): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, serviceId));
};
