import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logoutUser } from "@/services/auth.service";

export async function POST() { 
	try {
		const coockieStore = await cookies();
		const refreshToken = coockieStore.get("refreshToken")?.value;

		if (refreshToken) {
			await logoutUser(refreshToken);
		}
		
		const response = NextResponse.json(
			{ message: "User logged out successfully"},
			{ status: 200 }
		);

		response.cookies.set("refreshToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/api/refresh",
			maxAge: 0,
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
		}

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}

}