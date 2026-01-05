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
	email: z.email(),
	password: z.string().min(8),
});
export type SignupInput = z.infer<typeof signUpSchema>;

export const logInSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});
export type LoginInput = z.infer<typeof logInSchema>;

