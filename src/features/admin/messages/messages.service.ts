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
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

import type {
    CreateMessageInput,
    Message,
    UpdateMessageInput,
} from "./messages.types";

const MESSAGES_COLLECTION = "messages";

const messagesCollection = collection(db, MESSAGES_COLLECTION);

/**
 * Convert Firestore Timestamp values into JavaScript Date values.
 */
const convertMessageDates = (
    data: Record<string, unknown>
): Omit<Message, "id"> => {
    const createdAt = data.createdAt as
        | { toDate?: () => Date }
        | Date
        | undefined;

    const updatedAt = data.updatedAt as
        | { toDate?: () => Date }
        | Date
        | undefined;

    const repliedAt = data.repliedAt as
        | { toDate?: () => Date }
        | Date
        | null
        | undefined;

    return {
        ...(data as Omit<Message, "id">),

        createdAt:
            createdAt && "toDate" in createdAt && typeof createdAt.toDate === "function"
                ? createdAt.toDate()
                : createdAt instanceof Date
                    ? createdAt
                    : undefined,

        updatedAt:
            updatedAt && "toDate" in updatedAt && typeof updatedAt.toDate === "function"
                ? updatedAt.toDate()
                : updatedAt instanceof Date
                    ? updatedAt
                    : undefined,

        repliedAt:
            repliedAt && "toDate" in repliedAt && typeof repliedAt.toDate === "function"
                ? repliedAt.toDate()
                : repliedAt instanceof Date
                    ? repliedAt
                    : null,
    };
};

/**
 * Create a new contact message.
 */
export const createMessage = async (
    data: CreateMessageInput
): Promise<string> => {
    const docRef = await addDoc(messagesCollection, {
        ...data,
        status: "unread",
        isStarred: false,
        repliedAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
};

/**
 * Get all messages, newest first.
 */
export const getMessages = async (): Promise<Message[]> => {
    const messagesQuery = query(
        messagesCollection,
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(messagesQuery);

    return snapshot.docs.map((document) => ({
        id: document.id,
        ...convertMessageDates(
            document.data() as Record<string, unknown>
        ),
    }));
};

/**
 * Get a single message by ID.
 */
export const getMessageById = async (
    id: string
): Promise<Message | null> => {
    const docRef = doc(db, MESSAGES_COLLECTION, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...convertMessageDates(
            snapshot.data() as Record<string, unknown>
        ),
    };
};

/**
 * Update message status, starred state, or replied date.
 */
export const updateMessage = async (
    id: string,
    data: UpdateMessageInput
): Promise<void> => {
    const docRef = doc(db, MESSAGES_COLLECTION, id);

    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Delete a message.
 */
export const deleteMessage = async (id: string): Promise<void> => {
    const docRef = doc(db, MESSAGES_COLLECTION, id);

    await deleteDoc(docRef);
};