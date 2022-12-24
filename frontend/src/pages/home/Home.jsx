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
				<p>
					<span>
						<b>Disclaimer:</b>
					</span>{" "}
					<br />
					<span>
						This is not in any way to harvest anybody's data but for only
						testing purpose.
					</span>
				</p>
			</div>
		</div>
	);
};

export default Home;
