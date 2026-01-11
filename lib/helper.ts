import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
}

export async function comparePasswords(
	plainPassword: string,
	hashedPassword: string
	): Promise<boolean> {
	return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateRandomCode(length: number): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}
	return result;
}

export async function generateToken(length:number = 32): Promise<string> { 
	const buffer = await import("crypto").then(crypto => crypto.randomBytes(length));
	return buffer.toString("hex");
}