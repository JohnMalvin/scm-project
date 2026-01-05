import { User } from "@/models/User";
import { comparePasswords, hashPassword } from "@/lib/helper";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function signupUser(email: string, password: string) {
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new Error("User already exists");
	}

	const hashedPassword = await hashPassword(password);

	const newUser = await User.create({
		email,
		password: hashedPassword,
	});

	return newUser;
}

export async function loginUser(email: string, password: string) {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("User does not exist");
	}

	const isPasswordValid = await comparePasswords(
		password,
		user.password
	);

	if (!isPasswordValid) {
		throw new Error("Invalid password");
	}

	const accessToken = signAccessToken(user._id.toString());
	const refreshToken = signRefreshToken(user._id.toString());
	const hashedRefreshToken = await hashPassword(refreshToken);
	await user.updateOne({ refreshToken: hashedRefreshToken });

	return {
		user: {
			id: user._id.toString(),
			email: user.email,
		},
		accessToken,
		refreshToken,
	};
}

export async function logoutUser(refreshToken: string) {
	const user = await User.findOne({ refreshToken: {$ne: null} });
	if (!user) {
		throw new Error("User does not exist");
	}

	const isValid = await comparePasswords(refreshToken, user.refreshToken!);
	if (!isValid) {
		throw new Error("User does not exist");
	}
	
	user.refreshToken = null;
	await user.save();
}