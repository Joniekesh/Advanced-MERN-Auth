import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
		},
		googleEmail: {
			type: String,
		},
		avatar: {
			type: String,
		},
		password: {
			type: String,
		},
		googleId: {
			type: String,
		},
		regType: {
			type: String,
			required: true,
			default: "Email",
		},
		resetPasswordToken: {
			type: String,
		},
		resetPasswordExpire: {
			type: String,
		},
	},

	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSaltSync(10);
	this.password = await bcrypt.hashSync(this.password, salt);

	next();
});

UserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");

	// Hash token (private key) and save to database
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	// Set token expire date
	this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

	return resetToken;
};

export default mongoose.model("User", UserSchema);
