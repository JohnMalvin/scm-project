import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { checkUsername, sendVerificationCode, } from "@/services/auth.service";
import { generateRandomCode } from "@/lib/helper";

export async function GET(request: Request) { 
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const username = searchParams.get("username");
		if (!username) {
			return NextResponse.json(
				{ error: "Username is required" },
				{ status: 400 }
			);
		}
		
		const result = await checkUsername(username);
		if (result.exists) {
			const code = generateRandomCode(6);
			await sendVerificationCode(result.email, code);
		}
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Error in checkUsername:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}