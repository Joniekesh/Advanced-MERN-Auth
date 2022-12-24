import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(
	cors({
		origin: "https://advanced-mern-auth.onrender.com",

		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(`SERVER running on port ${PORT}`.yellow.bold)
);
