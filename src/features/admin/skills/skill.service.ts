
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
    Timestamp,
    type DocumentData,
} from "firebase/firestore";

import type {
    Skill,
    CreateSkillInput,
    UpdateSkillInput,
} from "./skill.types";
import { db } from "@/lib/firebase/client";

// Collection reference
const SKILLS_COLLECTION = "skills";

const skillsRef = collection(db, SKILLS_COLLECTION);

// Convert Firestore document into Skill type
const mapSkill = (id: string, data: DocumentData): Skill => {
    const skillData = data as Omit<
        Skill,
        "id" | "createdAt" | "updatedAt"
    > & {
        createdAt?: Timestamp;
        updatedAt?: Timestamp;
    };

    return {
        ...skillData,
        id,
        createdAt: skillData.createdAt?.toDate(),
        updatedAt: skillData.updatedAt?.toDate(),
    };
};

// Get all skills
export const getSkills = async (): Promise<Skill[]> => {
    const q = query(skillsRef, orderBy("displayOrder", "asc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) =>
        mapSkill(item.id, item.data())
    );
};

// Get active skills (Public Portfolio)
export const getActiveSkills = async (): Promise<Skill[]> => {
    const q = query(
        skillsRef,
        where("isActive", "==", true),
        orderBy("displayOrder", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) =>
        mapSkill(item.id, item.data())
    );
};

// Get skill by ID
export const getSkillById = async (
    id: string
): Promise<Skill | null> => {
    const skillDoc = doc(db, SKILLS_COLLECTION, id);

    const snapshot = await getDoc(skillDoc);

    if (!snapshot.exists()) return null;

    return mapSkill(snapshot.id, snapshot.data());
};

// Create skill
export const createSkill = async (
    input: CreateSkillInput
): Promise<string> => {
    const docRef = await addDoc(skillsRef, {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
};

// Update skill
export const updateSkill = async (
    id: string,
    input: UpdateSkillInput
): Promise<void> => {
    const skillDoc = doc(db, SKILLS_COLLECTION, id);

    await updateDoc(skillDoc, {
        ...input,
        updatedAt: serverTimestamp(),
    });
};

// Delete skill
export const deleteSkill = async (
    id: string
): Promise<void> => {
    const skillDoc = doc(db, SKILLS_COLLECTION, id);

    await deleteDoc(skillDoc);
};
