import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { avatarFileSchema, getAuthUser, userStatusSchema } from "@/lib/auth";
import { setStatus, uploadAvatarFile } from "@/services/auth.service";

export async function POST(request: Request) {
	try {
		await connectDB();

		const authUser = await getAuthUser(request);
		const userId = authUser.sub;

		const user = await User.findById(authUser.sub).select(
		"_id email createdAt"
		);

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}
		
		const formData = await request.formData();
		const file = formData.get("avatar") as File | null;
		
		if (!file) {
			return NextResponse.json(
				{ error: "No file uploaded" },
				{ status: 400 }
			);
		}

		const parsed = avatarFileSchema.safeParse(file);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0].message },
				{ status: 400 }
			);
		}

		const url = await uploadAvatarFile(file, userId);

		return NextResponse.json(
			{ message: "Upload successful", url },
			{ status: 200 }
		);


	} catch (error: unknown) {
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
