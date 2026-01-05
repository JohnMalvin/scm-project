import {Schema, model, models} from 'mongoose';

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
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