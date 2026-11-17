
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require.admin";
import {
    uploadImage,
    deleteImage,
} from "@/services/cloudinary/cloudinary.service";

const ALLOWED_FOLDERS = [
    "portfolio/projects",
    "portfolio/skills",
    "portfolio/experiences",
    "portfolio/education",
    "portfolio/test",
];

const MAX_GALLERY_IMAGES = 10;

type UploadResult = Awaited<ReturnType<typeof uploadImage>>;

export async function POST(request: Request) {
    const uploadedImages: UploadResult[] = [];

    try {
        await requireAdmin();

        const formData = await request.formData();

        const file = formData.get("file");
        const files = formData.getAll("files");
        const thumbnail = formData.get("thumbnail");
        const images = formData.getAll("images");

        const isProjectUpload = thumbnail !== null || images.length > 0;
        const isMultipleUpload = files.length > 0;
        const isSingleUpload = file !== null;

        // Prevent mixing different upload formats in one request.
        const uploadModes = [
            isProjectUpload,
            isMultipleUpload,
            isSingleUpload,
        ].filter(Boolean).length;

        if (uploadModes !== 1) {
            return NextResponse.json(
                { message: "Provide one valid upload format" },
                { status: 400 }
            );
        }

        let result:
            | { image: UploadResult }
            | { images: UploadResult[] }
            | { thumbnail: UploadResult; images: UploadResult[] };

        // 1. Project thumbnail + gallery upload
        if (isProjectUpload) {
            if (!(thumbnail instanceof File)) {
                return NextResponse.json(
                    { message: "Project thumbnail is required" },
                    { status: 400 }
                );
            }

            if (!images.every((image) => image instanceof File)) {
                return NextResponse.json(
                    { message: "Invalid gallery images" },
                    { status: 400 }
                );
            }

            if (images.length > MAX_GALLERY_IMAGES) {
                return NextResponse.json(
                    { message: "Maximum 10 gallery images allowed" },
                    { status: 400 }
                );
            }

            const projectFolder = "portfolio/projects";

            const uploaded = await Promise.all([
                uploadImage({ file: thumbnail, folder: projectFolder }),
                ...images.map((image) =>
                    uploadImage({
                        file: image as File,
                        folder: projectFolder,
                    })
                ),
            ]);

            uploadedImages.push(...uploaded);

            const [uploadedThumbnail, ...uploadedGallery] = uploaded;

            result = {
                thumbnail: uploadedThumbnail,
                images: uploadedGallery,
            };
        }

        // 2. Multiple image upload
        else if (isMultipleUpload) {
            if (!files.every((item) => item instanceof File)) {
                return NextResponse.json(
                    { message: "Invalid image files" },
                    { status: 400 }
                );
            }

            if (files.length > MAX_GALLERY_IMAGES) {
                return NextResponse.json(
                    { message: "Maximum 10 images allowed" },
                    { status: 400 }
                );
            }

            const folderValue = formData.get("folder");
            const folder =
                typeof folderValue === "string"
                    ? folderValue
                    : "portfolio/projects";

            if (!ALLOWED_FOLDERS.includes(folder)) {
                return NextResponse.json(
                    { message: "Invalid upload folder" },
                    { status: 400 }
                );
            }

            const uploaded = await Promise.all(
                files.map((item) =>
                    uploadImage({
                        file: item as File,
                        folder,
                    })
                )
            );

            uploadedImages.push(...uploaded);
            result = { images: uploaded };
        }

        // 3. Single image upload
        else {
            if (!(file instanceof File)) {
                return NextResponse.json(
                    { message: "Image file is required" },
                    { status: 400 }
                );
            }

            const folderValue = formData.get("folder");
            const folder =
                typeof folderValue === "string"
                    ? folderValue
                    : "portfolio/projects";

            if (!ALLOWED_FOLDERS.includes(folder)) {
                return NextResponse.json(
                    { message: "Invalid upload folder" },
                    { status: 400 }
                );
            }

            const uploaded = await uploadImage({ file, folder });

            uploadedImages.push(uploaded);
            result = { image: uploaded };
        }

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Image upload failed:", error);

        // Clean up any images uploaded before a failure.
        const cleanupResults = await Promise.allSettled(
            uploadedImages.map((image) => deleteImage(image.publicId))
        );

        const failedCleanups = cleanupResults.filter(
            (item) => item.status === "rejected"
        );

        if (failedCleanups.length > 0) {
            console.error("Cloudinary cleanup failed:", failedCleanups);
        }

        const message =
            error instanceof Error ? error.message : "Image upload failed";

        const status =
            message === "Unauthorized"
                ? 401
                : message === "Forbidden"
                    ? 403
                    : message.includes("Only JPEG") ||
                        message.includes("Image size")
                        ? 400
                        : 500;

        return NextResponse.json({ message }, { status });
    }
}
