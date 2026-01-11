import { Schema, model, models } from 'mongoose';

export const TOKEN_PURPOSES = [
'PASSWORD_RESET',
'EMAIL_VERIFICATION',
] as const;

export type TokenPurpose = typeof TOKEN_PURPOSES[number];

const VerificationTokenSchema = new Schema(
	{
		identifier: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			index: true,
		},

		hashedToken: {
			type: String,
			required: true,
			unique: true,
		},

		purpose: {
			type: String,
			enum: TOKEN_PURPOSES,
			required: true,
			index: true,
		},

		expiresAt: {
			type: Date,
			required: true,
		},

		used: {
			type: Boolean,
			default: false,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

VerificationTokenSchema.index(
	{ expiresAt: 1 },
	{ expireAfterSeconds: 0 }
);


VerificationTokenSchema.index({
	identifier: 1,
	purpose: 1,
	used: 1,
});

export const VerificationToken =
	models.VerificationToken ||
	model('VerificationToken', VerificationTokenSchema);