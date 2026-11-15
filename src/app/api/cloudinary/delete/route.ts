import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require.admin";
import { deleteImage } from "@/services/cloudinary/cloudinary.service";

export async function DELETE(request: Request) {
    try {
        await requireAdmin();

        const body = await request.json();
        const publicId = body.publicId;

        if (
            typeof publicId !== "string" ||
            !publicId.startsWith("portfolio/")
        ) {
            return NextResponse.json(
                { message: "Invalid public ID" },
                { status: 400 }
            );
        }

        await deleteImage(publicId);

        return NextResponse.json({
            success: true,
            message: "Image deleted successfully",
        });
    } catch (error) {
        console.error("Cloudinary delete error:", error);

        const message =
            error instanceof Error ? error.message : "Delete failed";

        const status =
            message === "Unauthorized" ? 401 :
                message === "Forbidden" ? 403 : 400;

        return NextResponse.json({ message }, { status });
    }
}