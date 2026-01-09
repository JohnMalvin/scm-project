import { User } from "@/models/User";
import { comparePasswords, hashPassword } from "@/lib/helper";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { transporter } from "@/lib/mailer";
import { EmailVerification } from "@/models/EmailVerification";

export async function checkUsername(username: string) { 
	const existingUser = await User.findOne({ username });
	return {result: !!existingUser};
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
}

export async function sendVerificationCode(email: string, code: string) {
	email = email.trim().toLowerCase();
	await EmailVerification.deleteMany({ email });

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

	await EmailVerification.create({
		email,
		expiration: new Date(Date.now() + 5 * 60 * 1000),
		emailVerificationCode: await hashPassword(code),
	});
	
}

export async function emailVerificationAlert(
	email: string,
	locked: boolean = false
) {
	email = email.trim().toLowerCase();

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
