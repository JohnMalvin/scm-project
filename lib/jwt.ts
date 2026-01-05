import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

if (!JWT_ACCESS_SECRET) {
	throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
}

export function signAccessToken(userId: string) {
	return jwt.sign(
		{ sub: userId },
		JWT_ACCESS_SECRET,
		{ expiresIn: "15m" }
	);
}

export function verifyAccessToken(token: string) { 
	return jwt.verify(token, JWT_ACCESS_SECRET) as {
		sub: string;
		iat: number;
		exp: number;
	};
}



const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!JWT_REFRESH_SECRET) {
	throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
}

export function signRefreshToken(userId: string) {
	return jwt.sign(
		{ sub: userId },
		JWT_REFRESH_SECRET,
		{ expiresIn: "7d" }
	);
}

export function verifyRefreshToken(token: string) { 
	return jwt.verify(token, JWT_REFRESH_SECRET) as {
		sub: string;
		iat: number;
		exp: number;
	};
}