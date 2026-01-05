import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
	try {
		await connectDB();

		const authUser = getAuthUser(request);

		const user = await User.findById(authUser.sub).select(
		"email createdAt"
		);

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ user },
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
