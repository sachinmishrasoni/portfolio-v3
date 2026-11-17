
import type { CloudinaryProjectImage } from "@/features/admin/projects/projects.types";

type UploadProjectImagesInput = {
    thumbnail: File;
    images: File[];
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok) {
        throw new Error(result.message || "Image upload failed");
    }

    return result.data;
};

// Single image upload
export const uploadCloudinaryImage = async (
    file: File,
    folder = "portfolio/projects"
): Promise<CloudinaryProjectImage> => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
    });

    const data = await parseResponse<{
        image: CloudinaryProjectImage;
    }>(response);

    return data.image;
};

// Multiple project images upload (thumbnail + gallery)
export const uploadProjectImages = async ({
    thumbnail,
    images,
}: UploadProjectImagesInput): Promise<{
    thumbnail: CloudinaryProjectImage;
    images: CloudinaryProjectImage[];
}> => {
    const formData = new FormData();

    formData.append("thumbnail", thumbnail);

    images.forEach((image) => {
        formData.append("images", image);
    });

    const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
    });

    return parseResponse<{
        thumbnail: CloudinaryProjectImage;
        images: CloudinaryProjectImage[];
    }>(response);
};

// Delete Cloudinary image
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

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Image deletion failed");
    }
};
