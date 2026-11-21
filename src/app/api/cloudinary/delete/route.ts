import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require.admin";
import { deleteImage } from "@/services/cloudinary/cloudinary.service";

export async function DELETE(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const publicIds = body.publicIds;

        if (
            !Array.isArray(publicIds) ||
            publicIds.length === 0 ||
            !publicIds.every(
                (id: unknown) => typeof id === "string" && id.trim()
            )
        ) {
            return NextResponse.json(
                { success: false, message: "Valid public IDs are required." },
                { status: 400 }
            );
        }

        if (publicIds.length > 50) {
            return NextResponse.json(
                { success: false, message: "Maximum 50 images can be deleted at once." },
                { status: 400 }
            );
        }

        const results = await Promise.allSettled(
            [...new Set(publicIds)].map((publicId: string) => deleteImage(publicId))
        );

        const deleted = results
            .filter((result) => result.status === "fulfilled")
            .length;

        const failed = results
            .map((result, index) => ({
                publicId: [...new Set(publicIds)][index],
                error: result.status === "rejected"
                    ? result.reason instanceof Error
                        ? result.reason.message
                        : "Deletion failed"
                    : null,
            }))
            .filter((result) => result.error !== null);

        return NextResponse.json({
            success: failed.length === 0,
            message: failed.length === 0
                ? "Images deleted successfully."
                : "Some images could not be deleted.",
            data: { deleted, failed },
        });
    } catch (error) {
        console.error("Cloudinary deletion error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to delete images." },
            { status: 500 }
        );
    }
}
