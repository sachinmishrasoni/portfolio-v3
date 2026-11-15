import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require.admin";
import { uploadImage } from "@/services/cloudinary/cloudinary.service";


const ALLOWED_FOLDERS = [
    "portfolio/projects",
    "portfolio/skills",
    "portfolio/experiences",
    "portfolio/education",
    "portfolio/test",
];

export async function POST(request: Request) {
    try {
        await requireAdmin();

        const formData = await request.formData();

        const file = formData.get("file");
        const folder = formData.get("folder");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { message: "Image file is required" },
                { status: 400 }
            );
        }

        const selectedFolder =
            typeof folder === "string" ? folder : "portfolio/projects";

        if (!ALLOWED_FOLDERS.includes(selectedFolder)) {
            return NextResponse.json(
                { message: "Invalid upload folder" },
                { status: 400 }
            );
        }

        const image = await uploadImage({
            file,
            folder: selectedFolder,
        });

        return NextResponse.json({
            success: true,
            data: image,
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        const message =
            error instanceof Error ? error.message : "Upload failed";

        const status =
            message === "Unauthorized" ? 401 :
                message === "Forbidden" ? 403 : 400;

        return NextResponse.json({ message }, { status });
    }
}