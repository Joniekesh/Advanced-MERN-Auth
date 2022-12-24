import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./resetPassword.scss";

const ResetPassword = () => {
	const [toggle, setToggle] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setconfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const { resetToken } = useParams();
	const navigate = useNavigate();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setPassword("");
			setconfirmPassword("");
			setTimeout(() => {
				setError("");
			}, 5000);
			return setError("Passwords do not match!");
		} else {
			try {
				const res = await axios.put(
					`https://advanced-mern-auth.onrender.com/auth/passwordreset/${resetToken}`,
					{ password, resetToken }
				);
				if (res.status === 200) {
					setSuccess(res.data.data);
				}
				navigate("/login");
			} catch (err) {
				setTimeout(() => {
					setError("");
				}, 5000);
				return setError(err.response.data);
			}
		}
	};

	return (
		<div className="resetPassword">
			{error && <div className="error">{error}</div>}
			{success && <div className="success">{success}</div>}

			<div className="container">
				<h2>Reset Your Password</h2>
				<span>Provide password different from the one previously used.</span>
				<form onSubmit={submitHandler}>
					<div className="inputGroup">
						<label>Password</label>

						<div className="group">
							<input
								type={toggle ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<i
								className="fa-solid fa-eye-slash"
								onClick={() => setToggle(!toggle)}
							></i>
						</div>
					</div>
					<div className="inputGroup">
						<label>Confirm Password</label>

						<div className="group">
							<input
								type={toggle ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setconfirmPassword(e.target.value)}
							/>
						</div>
					</div>
					<button type="submit">Reset</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
