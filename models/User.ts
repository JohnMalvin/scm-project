import {Schema, model, models} from 'mongoose';

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		refreshTokens: {
			type: String,
			default: null,
			select: false,
		},
	},
	{ timestamps: true }
);

export const User = models.User || model('User', userSchema);