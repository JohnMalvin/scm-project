import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { checkUsername, } from "@/services/auth.service";

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
		return NextResponse.json(result, { status: 200 });
	} catch  {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}