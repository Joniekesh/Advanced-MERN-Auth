import "./forgotPassword.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const submitHandler = async (e) => {
		e.preventDefault();

		try {
			const res = await axios.post(
				"https://advanced-mern-auth.onrender.com/auth/forgotPassword",
				{ email }
			);
			if (res.status === 200) {
				setEmail("");
				setSuccess(res.data);
			}
		} catch (err) {
			console.log(error);
			setTimeout(() => {
				setError("");
			}, 5000);
			return setError(err.response.data);
		}
	};

	return (
		<div className="forgotPassword">
			{error && <div className="error">{error}</div>}
			{success && <div className="success">{success}</div>}
			<div className="container">
				<h2>Forgot Password?</h2>
				<span>
					Please enter the email you registered with in this platform. We will
					email you the reset instruction.
				</span>
				<form onSubmit={submitHandler}>
					<div className="inputGroup">
						<label>Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<button type="submit">Send</button>
				</form>
				<Link to="/login">
					<button>Go Back</button>
				</Link>
			</div>
		</div>
	);
};

export default ForgotPassword;
