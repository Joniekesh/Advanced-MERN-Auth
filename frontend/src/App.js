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
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Navbar from "./components/navbar/Navbar";

const App = () => {
	const [TOKEN, setToken] = useState("");

	useEffect(() => {
		const currentUser = JSON.parse(localStorage.getItem("user"));
		setToken(currentUser?.token);
	}, []);

	const ProtectedRoute = ({ children }) => {
		if (!TOKEN) {
			return <Navigate to="/login" />;
		}

		return children;
	};

	return (
		<Router>
			<Navbar />
			<Routes>
				<Route
					exact
					path="/"
					element={
						<ProtectedRoute>
							<Home />
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
