import {Schema, model, models} from 'mongoose';

export const USER_STATUS = [
'BUYER',
'SELLER',
] as const;

export type UserStatus = typeof USER_STATUS[number];

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
		status: {
			type: String,
			enum: USER_STATUS,
			default: null,
		},
		avatarUrl: {
			type: String,
			default:"/default-avatar-buyer.png"
		},
	},
	{ timestamps: true }
);

export const User = models.User || model('User', userSchema);