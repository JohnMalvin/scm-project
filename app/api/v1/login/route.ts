import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { logInSchema } from "@/lib/auth";
import { loginUser } from "@/services/auth.service";

export async function POST(request: Request) { 
	try {
		await connectDB();
		const body = await request.json();
		const parsed = logInSchema.safeParse(body);

		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid input data" },
				{ status: 400 }
			);
		}

		const user = await loginUser(
			parsed.data.email,
			parsed.data.password
		);

		const response = NextResponse.json(
			{ message: "User logged in successfully", user },
			{ status: 200 }
		);

		response.cookies.set("refreshToken", user.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/api/refresh",
			maxAge: 7 * 24 * 60 * 60, // 7 days
		});
		return response;

	} catch (error: unknown) {
		if (error instanceof Error) { 
			if (error.message === "User does not exist") {
				return NextResponse.json(
					{ error: "Invalid credentials" },
					{ status: 401 }
				);
			}
			
			if (error.message === "Invalid password") {
				return NextResponse.json(
					{ error: "Invalid credentials" },
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