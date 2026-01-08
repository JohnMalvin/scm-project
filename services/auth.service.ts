import { User } from "@/models/User";
import { comparePasswords, hashPassword } from "@/lib/helper";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function signupUser(username: string, email: string, password: string) {
	const existingEmail = await User.findOne({ email });
	const existingUsername = await User.findOne({ username });
	if (existingEmail) {
		throw new Error("Email already exists");
	}
	if (existingUsername) {
		throw new Error("Username already exists");
	}

	const hashedPassword = await hashPassword(password);

	const newUser = await User.create({
		username,
		email,
		password: hashedPassword,
	});

	return newUser;
}

export async function loginUser(username: string, password: string) {
	const user = await User.findOne({ username });
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
			username: user.username,
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