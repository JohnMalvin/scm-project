import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/auth";
import { resetPassword } from "@/services/auth.service";
import { cookies } from "next/headers";

export async function POST(request: Request) { 
	const cookieStore = await cookies();
	const token = cookieStore.get("emailVerificationToken")?.value;

	if (!token) {
		return NextResponse.json(
			{ error: "Unauthorized" },
			{ status: 401 }
		);
	}

	try {
		await connectDB();
		const body = await request.json();
		const parsed = resetPasswordSchema.safeParse(body);
		
		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0].message ?? "Invalid input data" },
				{ status: 400 }
			);
		}

		const user = await resetPassword(
			token,
			parsed.data.email,
			parsed.data.newPassword
		);

		return NextResponse.json(
			{
				message: "User password reset successfully",
				userId: user.id
			},
			{ status: 200 }
		);

	} catch (error: unknown) {
		if (error instanceof Error && (error.message === "User does not exist" )) {
			return NextResponse.json(
				{ error: error.message },
				{ status: 409 }
			);
		}

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}

}