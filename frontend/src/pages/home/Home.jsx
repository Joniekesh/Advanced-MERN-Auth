import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import "./home.scss";

const Home = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const currentUser = JSON.parse(localStorage.getItem("user"));
		setUser(currentUser?.user);
	}, []);

	return (
		<div className="home">
			<div className="container">
				<h1>{user?.fullName}</h1>
				<span>Welcome to our platform.</span>
			</div>
		</div>
	);
};

export default Home;
