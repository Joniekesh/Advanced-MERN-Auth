import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/generateToken.js";
import { protect } from "../middleware/auth.js";
import { sendEmail } from "./utils/sendEmail.js";
import crypto from "crypto";

const router = express.Router();

// Register by google
router.post("/google", async (req, res) => {
	const { fullName, avatar, googleId, googleEmail, regType } = req.body;

	const newUser = new User({
		fullName,
		avatar,
		googleId,
		googleEmail,
		regType,
	});

	try {
		const user = await User.findOne({ googleId });

		if (user) {
			res.status(200).json({ user, token: generateToken(user._id) });
		} else {
			const savedUser = await newUser.save();
			res
				.status(200)
				.json({ user: savedUser, token: generateToken(savedUser._id) });
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

// Register user by email
router.post("/register", async (req, res) => {
	const { fullName, email, password } = req.body;

	const newUser = new User({
		fullName,
		email,
		password,
	});

	try {
		const user = await User.findOne({ email });

		if (user) {
			return res
				.status(400)
				.json(`User with email ${user.email} already exists!`);
		}

		const savedUser = await newUser.save();

		res
			.status(201)
			.json({ user: savedUser, token: generateToken(savedUser._id) });
	} catch (error) {
		res.status(500).json(error);
	}
});

// Login User by email
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) return res.status(404).json("User not found!");

		const isMatch = await bcrypt.compareSync(req.body.password, user.password);
		if (!isMatch) return res.status(401).json("Incorrect password.");

		res.status(200).json({ user, token: generateToken(user._id) });
	} catch (error) {
		res.status(500).json(error);
	}
});

// Get logged in profile
router.get("/me", protect, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json(error);
	}
});

// Forgot password
router.post("/forgotPassword", async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user)
			return res
				.status(404)
				.json(`No user with email: ${email} found in the database.`);

		// Reset token generated and add hashed version to database
		const resetToken = user.getResetPasswordToken();

		await user.save();

		// Create Reset URL to email to provided email address
		const resetUrl = `https://advanced-mern-authentication.netlify.app/passwordreset/${resetToken}`;

		//HTML Message
		const message = `
		<h1>You have requested for a password reset.</h1>
      <p>Please reset your password using the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
		`;

		try {
			await sendEmail({
				to: user.email,
				subject: "Password Reset Request.",
				text: message,
			});

			res
				.status(200)
				.json("Email sent. Please check your inbox for a reset link.");
		} catch (error) {
			res.status(500).json(error);

			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save();
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

// Reset password
router.put("/passwordreset/:resetToken", async (req, res) => {
	// Compare token in url to hashed token
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.body.resetToken)
		.digest("hex");

	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user)
			return res
				.status(400)
				.json("Invalid/expired token. Please resend Reset Request.");

		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.status(200).json({
			success: true,
			data: "Password Update Success! You can now login.",
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
