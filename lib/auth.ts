import { z } from "zod";
import { verifyAccessToken } from "./jwt";
import { USER_STATUS } from "@/models/User";
import { cookies } from "next/headers";

export async function getAuthUser(request: Request) {
	const authHeader = request.headers.get("Authorization");
	if (authHeader?.startsWith("Bearer ")) {
		const token = authHeader.split(" ")[1];
		return verifyAccessToken(token);
	}

	const cookieStore = await cookies();
	const token = cookieStore.get("accessToken")?.value;

	if (!token) {
		throw new Error("NO_TOKEN");
	}
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
	identifier: z.string()
	.min(3, "Username or email must be at least 3 characters long")
		.refine((val) => {
			const isEmail = z.email().safeParse(val).success;
			const isUsername = /^[a-zA-Z0-9_]+$/.test(val);
			return isEmail || isUsername;
		}, {
			message: "Identifier must be a valid email or username"
		}
		),
		password: z.string()
		.min(8, "Password must be at least 8 characters long")
		.max(20, "Password must be at most 20 characters long"),
	});
export type LoginInput = z.infer<typeof logInSchema>;
	
	
export const resetPasswordSchema = z.object({
	email: z.email("Invalid email address"),

	newPassword: z.string()
	.min(8, "Password must be at least 8 characters long")
	.max(20, "Password must be at most 20 characters long"),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;


export const emailVerificationSchema = z.object({
	email: z.email("Invalid email address"),
	code: z.string().length(6, "Verification code must be 6 characters long"),
});
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;


export const userStatusSchema = z.object({
	status: z.enum(USER_STATUS, {
		message: "Invalid user status"
	})
});
export type UserStatus = z.infer<typeof userStatusSchema>;

export const avatarFileSchema = z.instanceof(File).refine(
	(file) => file.size <= 5 * 1024 * 1024,
	{ message: "File must be smaller than 5MB" }
).refine(
	(file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
	{ message: "Only PNG or JPEG images are allowed" }
);

export type AvatarFile = z.infer<typeof avatarFileSchema>;
