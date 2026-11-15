import type { CloudinaryUploadResult } from "@/types/image.types";

export const uploadCloudinaryImage = async (
    file: File,
    folder = "portfolio/projects"
): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Image upload failed");
    }

    return result.data;
};

export const deleteCloudinaryImage = async (
    publicId: string
): Promise<void> => {
    const response = await fetch("/api/cloudinary/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Image deletion failed");
    }
};