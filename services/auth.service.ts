import { User, UserStatus } from "@/models/User";
import { comparePasswords, generateToken, hashPassword } from "@/lib/helper";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { transporter } from "@/lib/mailer";
import { EmailVerification } from "@/models/EmailVerification";
import { VerificationToken } from "@/models/VerificationToken";

export async function checkUsername(username: string) { 
	const existingUser = await User.findOne({ username });
	if (!existingUser) {
		return {exists: false}
	}
	return {
		exists: true,
		email: existingUser.email,
	};
}

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

export async function loginUser(identifier: string, password: string) {
	const normalizedIdentifier = identifier.trim().toLowerCase();
	const user = await User.findOne({
		$or: [
			{ username: normalizedIdentifier },
			{ email: normalizedIdentifier }
		]
	}).select("+password +refreshToken");

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

	await user.updateOne({
		refreshToken: await hashPassword(refreshToken)
	});

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
	const users = await User.find({ refreshToken: { $ne: null } }).select("+refreshToken");

	for (const user of users) {

		let isValid = false;
		try {
			isValid = await comparePasswords(refreshToken, user.refreshToken);
		} catch (err) {
			console.error("comparePasswords failed:", err);
			continue;
		}

		if (isValid) {
			user.refreshToken = null;
			await user.save();
			return;
		}
	}

	throw new Error("User does not exist");
}

export async function verifyEmailCode(email: string, code: string) { 
	email = email.trim().toLowerCase();
	code = code.trim();

	const record = await EmailVerification.findOne({ email });
	if (!record || !record.emailVerificationCode) {
		throw new Error("Invalid verification code");
	}

	if (record.lockedUntil && record.lockedUntil > new Date()) {
		throw new Error("Invalid verification code");
	}

	if (record.expiration < new Date()) {
		await EmailVerification.deleteOne({ email });
		throw new Error("Invalid verification code");
	}
	
	const isValid = await comparePasswords(
		code,
		record.emailVerificationCode
	);

	if (!isValid) {
		record.attemptCount += 1;

		const MAX_ATTEMPTS = 5;
		const ALERT_WINDOW_MS = 15 * 60 * 1000;
		const LOCK_WINDOW_MS = 15 * 60 * 1000;

		const now = Date.now();
		const canSendAlert =
			!record.alertSentAt ||
			(now - record.alertSentAt.getTime()) > ALERT_WINDOW_MS;

		if (record.attemptCount >= MAX_ATTEMPTS) {
			record.lockedUntil = new Date(now +  LOCK_WINDOW_MS);

			if (canSendAlert) { 
				try {
					await emailVerificationAlert(email, true);
					record.alertSentAt = new Date();
				} catch (err) {
					console.error("Alert email failed:", err);
				}
			}
		} else if (canSendAlert) {
			try {
				await emailVerificationAlert(email);
				record.alertSentAt = new Date();
			} catch (err) {
				console.error("Alert email failed:", err);
			}
		}

		await record.save();
		throw new Error("Invalid verification code");
	}

	await EmailVerification.deleteMany({ email });
	const token = await generateToken();
	const hashedToken = await hashPassword(token);

	await VerificationToken.create({
		identifier: email,
		hashedToken,
		purpose: "PASSWORD_RESET",
		expiresAt: new Date(Date.now() + 15 * 60 * 1000),
	});
	
	return token;
}

export async function sendVerificationCode(email: string, code: string) {
	email = email.trim().toLowerCase();
	const now = Date.now();

	let record = await EmailVerification.findOne({ email });
	if (record) {
		if (record.lockedUntil && record.lockedUntil > new Date()) {
			throw new Error("Too many request");
		}
	}

	if (!record) {
		record = new EmailVerification({
			email,
			attemptCount: 1,
			expiration: new Date(now + 5 * 60 * 1000),
		})
	} else {
		record.attemptCount += 1;
		record.expiration = new Date(now + 5 * 60 * 1000);
	}

	if (record.attemptCount >= 5) {
		record.lockedUntil = new Date(now + 15 * 60 * 1000);

		if (!record.alertSentAt || now - record.alertSentAt.getTime() > now + 15 * 60 * 1000) {
			await emailVerificationAlert(email, true);
			record.alertSentAt = new Date();
		}

		await record.save();
		throw new Error("Too many requests");
	}

	await transporter.sendMail({
		from: `"My App" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Your verification code",
		html: `
			<h2>Email Verification</h2>
			<p>Your verification code is:</p>
			<h1 style="letter-spacing: 4px;">${code}</h1>
			<p>This code expires in 5 minutes.</p>
			<p>If you did not request this, you can ignore this email.</p>
		`,
	});

	record.emailVerificationCode = await hashPassword(code);
	record.createdAt = new Date();
	await record.save();
}

export async function emailVerificationAlert(
	email: string,
	locked: boolean = false
) {
	email = email.trim().toLowerCase();

	const record = await EmailVerification.findOne({ email });
	if (record.lockedUntil !== null) {
		return;
	}

	const time = new Date().toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});

	const title = locked
		? "Verification temporarily locked"
		: "Verification attempt";

	const message = locked
		? `
			<p>
				We detected multiple unsuccessful verification attempts for this email
				address, so verification has been temporarily limited.
			</p>

			<p>
				You can request a new verification code after a short wait.
			</p>
		`
		: `
			<p>
				A verification attempt for this email address was unsuccessful.
			</p>

			<p>
				If this was you, you can safely ignore this message and try again.
			</p>
	`;

	await transporter.sendMail({
		from: `"My App" <${process.env.EMAIL_USER}>`,
		to: email,
		subject: "Security alert: verification activity",
		html: `
			<h3>${title}</h3>

			${message}

			<ul>
				<li><strong>Time:</strong> ${time}</li>
			</ul>

			<p style="color:#666;font-size:13px;">
				If you did not attempt this, we recommend securing your account.
			</p>
		`,
	});
}

export async function resetPassword(token: string, email: string, newPassword: string) {
	email = email.trim().toLowerCase();

	const verificationRecord = await VerificationToken.findOneAndUpdate(
		{
			identifier: email,
			purpose: "PASSWORD_RESET",
			used: false,
			expiresAt: { $gt: new Date() },
		},
		{ $set: { used: true } },
		{ new: true }
	);

	if (!verificationRecord) {
		throw new Error("Invalid or expired reset token");
	}
	const isValid = await comparePasswords(token, verificationRecord.hashedToken);
	if (!isValid) {
		throw new Error("Invalid or expired reset token");
	}

	await VerificationToken.deleteMany({
		identifier: email,
		purpose: "PASSWORD_RESET",
	});

	
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Invalid or expired reset token");
	}

	user.password = await hashPassword(newPassword);
	await user.save();
	return user;
}

export async function setStatus(userId: string, status: UserStatus) {
	const user = await User.findByIdAndUpdate(
		userId,
		{ status },
		{ new: true }
	);

	if (!user) {
		throw new Error("User does not exist");
	}
	return user;
}