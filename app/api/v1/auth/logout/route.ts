import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logoutUser } from "@/services/auth.service";

export async function POST() {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refreshToken")?.value;

		if (!refreshToken) {
			return NextResponse.json({ error: "No refresh token received" }, { status: 400 });
		}

		try {
			await logoutUser(refreshToken);
		} catch (err) {
			console.error("Error inside logoutUser:", err);
			return NextResponse.json({ error: "logoutUser failed" }, { status: 500 });
		}

		const response = NextResponse.json(
			{ message: "User logged out successfully" },
			{ status: 200 }
		);

		response.cookies.set("refreshToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0,
		});

		return response;

	} catch (error) {
		console.error("Unexpected logout error:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
