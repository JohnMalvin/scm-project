import { z } from "zod";
import { verifyAccessToken } from "./jwt";

export function getAuthUser(request: Request) {
	const authHeader = request.headers.get("Authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new Error("NO_TOKEN");
	}

	const token = authHeader.split(" ")[1];
	try {
		return verifyAccessToken(token);
	} catch {
		throw new Error("INVALID_TOKEN");
	}
}

export const signUpSchema = z.object({
	username: z.string()
		.min(3, "Username must be at least 3 characters long")
		.max(20, "Username must be at most 20 characters long")
		.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
	
	email: z.email("Invalid email address"),
	password: z.string()
		.min(8, "Password must be at least 8 characters long")
		.max(20, "Password must be at most 20 characters long"),
});
export type SignupInput = z.infer<typeof signUpSchema>;

export const logInSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});
export type LoginInput = z.infer<typeof logInSchema>;

