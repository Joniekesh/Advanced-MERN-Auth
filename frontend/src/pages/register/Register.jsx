import "./register.scss";
import GoogleIcon from "../../images/googleIcon.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import axios from "axios";

const Register = () => {
	const [toggle, setToggle] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [currentUser, setCurrentUser] = useState({ user: null, token: "" });

	const [error, setError] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setconfirmPassword] = useState("");
	const [avatar, setAvatar] = useState("");
	const [googleId, setGoogleId] = useState("");
	const [googleEmail, setGoogleEmail] = useState("");
	const [regType, setRegType] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		function start() {
			gapi.client.init({
				clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
				scope: "email",
			});
		}

		gapi.load("client:auth2", start);
	}, []);

	const googleLoginSuccess = async (response) => {
		if (response) {
			try {
				const res = await axios.post(
					"https://advanced-mern-auth.onrender.com/auth/google",
					{
						fullName: response?.profileObj.name,
						avatar: response?.profileObj.imageUrl,
						googleId: response?.profileObj.googleId,
						googleEmail: response?.profileObj.email,
						regType: "Google",
					}
				);
				if (res.status === 200) {
					setCurrentUser(res.data);
					localStorage.setItem("user", JSON.stringify(res.data));
					window.location.replace("/");
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const googleLoginFailure = (error) => {
		console.log(error);
		console.log("Error with google login!");
	};

	const handleSubmit = async (e) => {
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
				const res = await axios.post(
					"https://advanced-mern-auth.onrender.com/auth/register",
					{
						fullName,
						email,
						password,
					}
				);
				if (res.status === 201) {
					setCurrentUser(res.data);
					localStorage.setItem("user", JSON.stringify(res.data));
					window.location.replace("/");
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div className="register">
			{error && <div className="error">{error}</div>}
			<div className="container">
				<div className="left">
					<h2>Advanced MERN Authentication.</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
						ullam qui voluptates hic. Earum enim doloribus ex repellendus at
						laborum eligendi beatae autem voluptate alias, voluptatem dolor eum?
						Voluptatum, sequi!
					</p>
				</div>
				<div className="right">
					<h2>Create an account</h2>
					<p>Get started with creating your account</p>
					<form onSubmit={handleSubmit}>
						<div className="inputGroup">
							<label>Name</label>
							<input
								type="text"
								onChange={(e) => setFullName(e.target.value)}
								value={fullName}
							/>
						</div>
						<div className="inputGroup">
							<label>Email</label>
							<input
								type="email"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
						</div>
						<div className="inputGroup">
							<label>Password</label>
							<div className="group">
								<input
									type={toggle ? "text" : "password"}
									onChange={(e) => setPassword(e.target.value)}
									value={password}
									required
								/>
								<i
									className="fa-solid fa-eye-slash"
									onClick={() => setToggle(!toggle)}
								></i>
							</div>
						</div>
						<div className="inputGroup">
							<label> Confirm Password</label>

							<div className="group">
								<input
									type={toggle ? "text" : "password"}
									name="confirmPassword"
									onChange={(e) => setconfirmPassword(e.target.value)}
									value={confirmPassword}
								/>
							</div>
						</div>
						<button type="submit">Create Account</button>
					</form>
					<GoogleLogin
						clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
						render={(renderProps) => (
							<button
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
							>
								<img src={GoogleIcon} alt="" />

								<span>Sign Up with Google</span>
							</button>
						)}
						onSuccess={googleLoginSuccess}
						onFailure={googleLoginFailure}
						cookiePolicy={"single_host_origin"}
					/>
					Already have an account?<Link to="/login">Login</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
