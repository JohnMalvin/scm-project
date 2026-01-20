import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * REQUIRED for fs + File handling
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
	try {
		/* ---------- DB ---------- */
		await connectDB();

		/* ---------- AUTH ---------- */
		const authUser = await getAuthUser(request);
		const userId = authUser.sub;

		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		/* ---------- FORM DATA ---------- */
		const formData = await request.formData();

		console.log("📦 formData keys:", [...formData.keys()]);

		const file = formData.get("avatar");

		if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
			return NextResponse.json(
				{ error: "Avatar file is required" },
				{ status: 400 }
			);
		}

		const mimeType = (file as any).type;
		const size = (file as any).size;
		const originalName = (file as any).name;

		if (!ALLOWED_TYPES.includes(mimeType)) {
			return NextResponse.json(
				{ error: "Invalid file type" },
				{ status: 400 }
			);
		}

		if (size > MAX_SIZE) {
			return NextResponse.json(
				{ error: "File too large (max 2MB)" },
				{ status: 400 }
			);
		}

		/* ---------- FILE SAVE ---------- */
		const buffer = Buffer.from(
			await (file as any).arrayBuffer()
		);

		const ext = path.extname(originalName || ".png");
		const filename = `${crypto.randomUUID()}${ext}`;

		const uploadDir = path.join(
			process.cwd(),
			"public",
			"uploads",
			"avatars"
		);

		console.log("📁 Upload dir:", uploadDir);

		await fs.mkdir(uploadDir, { recursive: true });

		const filePath = path.join(uploadDir, filename);
		await fs.writeFile(filePath, buffer);

		const avatarUrl = `/uploads/avatars/${filename}`;

		/* ---------- DB UPDATE ---------- */
		user.avatar = avatarUrl;
		await user.save();

		/* ---------- RESPONSE ---------- */
		return NextResponse.json(
			{
				message: "Avatar uploaded successfully",
				avatar: avatarUrl,
			},
			{ status: 200 }
		);

	} catch (error: unknown) {
		console.error("❌ Upload avatar error:", error);

		if (error instanceof Error) {
			if (error.message === "NO_TOKEN") {
				return NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 }
				);
			}

			if (error.message === "INVALID_TOKEN") {
				return NextResponse.json(
					{ error: "Invalid or expired token" },
					{ status: 401 }
				);
			}
		}

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
