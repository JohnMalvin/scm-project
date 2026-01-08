import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { signUpSchema } from "@/lib/auth";
import { signupUser } from "@/services/auth.service";

export async function POST(request: Request) { 
	try {
		await connectDB();
		const body = await request.json();
		const parsed = signUpSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0].message ?? "Invalid input data" },
				{ status: 400 }
			);
		}

		const newUser = await signupUser(
			parsed.data.username,
			parsed.data.email,
			parsed.data.password
		);

		console.log("New user created:", newUser);
		return NextResponse.json(
			{
				message: "User created successfully",
				userId: newUser.id
			},
			{ status: 201 }
		);

	} catch (error: unknown) {
		if (error instanceof Error && (error.message === "Email already exists" || error.message === "Username already exists")) {
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