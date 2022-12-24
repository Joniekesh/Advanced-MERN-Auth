import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import { useEffect, useState } from "react";
import axios from "axios";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Navbar from "./components/navbar/Navbar";

const App = () => {
	const [profile, setProfile] = useState(null);
	const currentUser = JSON.parse(localStorage.getItem("user"));
	const user = currentUser?.user;
	const TOKEN = currentUser?.token;

	const ProtectedRoute = ({ children }) => {
		if (!user) {
			return <Navigate to="/login" />;
		}

		return children;
	};

	const config = {
		headers: {
			Authorization: `Bearer ${TOKEN}`,
		},
	};

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axios.get(
					"https://advanced-mern-auth.onrender.com/me",
					config
				);

				setProfile(res.data);
				localStorage.setItem("profile", JSON.stringify(res.data));
			} catch (error) {
				console.log(error);
			}
		};
		fetchProfile();
	}, []);

	return (
		<Router>
			<Navbar profile={profile} />
			<Routes>
				<Route
					exact
					path="/"
					element={
						<ProtectedRoute>
							<Home profile={profile} />
						</ProtectedRoute>
					}
				></Route>
				<Route
					path="/forgotpassword"
					element={TOKEN ? <Home /> : <ForgotPassword />}
				></Route>
				<Route path="/auth" element={TOKEN ? <Home /> : <Register />}></Route>
				<Route path="/login" element={TOKEN ? <Home /> : <Login />}></Route>
				<Route
					path="/passwordreset/:resetToken"
					element={TOKEN ? <Home /> : <ResetPassword />}
				></Route>
			</Routes>
		</Router>
	);
};

export default App;
