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
		password: {
			type: String,
			required: true,
			select: false,
		},
		refreshToken: {
			type: String,
			default: null,
			select: false,
		},
	},
	{ timestamps: true }
);

export const User = models.User || model('User', userSchema);