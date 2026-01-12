import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("accessToken")?.value;

	if (!token) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const payload = verifyAccessToken(token);
		return Response.json({ userId: payload.sub }, { status: 200 });
	} catch {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	}
