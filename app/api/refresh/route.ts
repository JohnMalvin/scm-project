import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/models/User";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { comparePasswords, hashPassword } from "@/lib/helper";

export async function POST() {
	try {
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refreshToken")?.value;

		if (!refreshToken) {
			return NextResponse.json({ error: "No refresh token" }, { status: 401 });
		}

		let payload;
		try {
			payload = verifyRefreshToken(refreshToken);
		} catch {
			return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
		}

		const user = await User.findById(payload.sub);
		if (!user || !user.refreshToken) {
			return NextResponse.json({ error: "Refresh token not found" }, { status: 401 });
		}

		const isValid = await comparePasswords(refreshToken, user.refreshToken);
		if (!isValid) {
			return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
		}

		const newAccessToken = signAccessToken(user._id.toString());
		const newRefreshToken = signRefreshToken(user._id.toString());

		const hashedNewRefreshToken = await hashPassword(newRefreshToken);
		await user.updateOne({ refreshToken: hashedNewRefreshToken });

		const response = NextResponse.json({ accessToken: newAccessToken });
		response.cookies.set("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 7 * 24 * 60 * 60, // 7 days
		});

		return response;
	  
	} catch (error) {
		console.error("Refresh token error:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
