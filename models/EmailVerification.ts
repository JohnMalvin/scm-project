import {Schema, model, models} from 'mongoose';

const emailVerificationSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		emailVerificationCode: {
			type: String,
			default: null,
		},
		expiration: {
			type: Date,
			required: true,
		},
		attemptCount: {
			type: Number,
			default: 0,
		},
		lockedUntil: {
			type: Date,
			default: null,
		},
		alertSentAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

emailVerificationSchema.index({ expiration: 1 }, { expireAfterSeconds: 0 });

export const EmailVerification = models.EmailVerification || model('EmailVerification', emailVerificationSchema);
