import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { emailVerificationSchema } from "@/lib/auth";
import { generateRandomCode } from "@/lib/helper";
import { sendVerificationCode } from "@/services/auth.service";

export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();

		const parsed = emailVerificationSchema
			.pick({ email: true })
			.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0].message },
				{ status: 400 }
			);
		}

		const { email } = parsed.data;
		const code = generateRandomCode(6);

		await sendVerificationCode(email, code);

		return NextResponse.json(
			{ message: "Verification email sent" },
			{ status: 200 }
		);
		
	} catch {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
