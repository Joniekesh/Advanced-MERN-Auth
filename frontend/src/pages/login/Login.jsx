import "./login.scss";
import GoogleIcon from "../../images/googleIcon.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import axios from "axios";

const Login = () => {
	const [toggle, setToggle] = useState(false);
	const [isLogin, setIsLogin] = useState(true);

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setconfirmPassword] = useState("");
	const [avatar, setAvatar] = useState("");
	const [googleId, setGoogleId] = useState("");
	const [googleEmail, setGoogleEmail] = useState("");
	const [regType, setRegType] = useState("");
	const [error, setError] = useState("");

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

		try {
			const res = await axios.post(
				"https://advanced-mern-auth.onrender.com/auth/login",
				{
					email,
					password,
				}
			);
			if (res.status === 200) {
				localStorage.setItem("user", JSON.stringify(res.data));
				window.location.replace("/");
			}
		} catch (err) {
			setTimeout(() => {
				setError("");
			}, 5000);
			return setError(err.response.data);
		}
	};

	return (
		<div className="login">
			{error && <div className="error">{error}</div>}

			<div className="container">
				<div className="left">
					<h2>Login</h2>
					<form onSubmit={handleSubmit}>
						<div className="inputGroup">
							<label>Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
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

						<button type="submit">Login</button>
					</form>
					<div className="rDiv">
						<div className="remember">
							<input type="checkbox" />
							<span>Remember me</span>
						</div>
						<Link to="/forgotpassword">
							<span>Forgort Password?</span>
						</Link>
					</div>
					<>
						<GoogleLogin
							clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
							render={(renderProps) => (
								<button
									onClick={renderProps.onClick}
									disabled={renderProps.disabled}
								>
									<img src={GoogleIcon} alt="" />

									<span>Sign In with Google</span>
								</button>
							)}
							onSuccess={googleLoginSuccess}
							onFailure={googleLoginFailure}
							cookiePolicy={"single_host_origin"}
						/>
					</>
					Don't have an account?<Link to="/auth">Register</Link>
				</div>
				<div className="right">
					<h2>Advanced MERN Authentication.</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
						ullam qui voluptates hic. Earum enim doloribus ex repellendus at
						laborum eligendi beatae autem voluptate alias, voluptatem dolor eum?
						Voluptatum, sequi!
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
