import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { emailVerificationSchema } from "@/lib/auth";
import { verifyEmailCode } from "@/services/auth.service";

export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();

		const parsed = emailVerificationSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0].message },
				{ status: 400 }
			);
		}

		const { email, code } = parsed.data;

		const token = await verifyEmailCode(email, code);

		const response =  NextResponse.json(
			{ message: "Email verified successfully" },
			{ status: 200 }
		);

		response.cookies.set("emailVerificationToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 15 * 60,
			path: "/",
		});

		return response;

	} catch (error) {
		if (error instanceof Error && error.message === "Invalid verification code") {
			return NextResponse.json(
				{ error: "Invalid verification code" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
