import "./navbar.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const currentUser = JSON.parse(localStorage.getItem("user"));
		setUser(currentUser?.user);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
		window.location.replace("/login");
	};

	return (
		<div className="navbar">
			<div className="container">
				<div className="left">
					<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
						<h2>MERN Auth</h2>
					</Link>
				</div>
				<div className="right">
					{user && (
						<>
							<span>{user?.fullName}</span>
							<img src={user?.avatar} alt="" />
							<button onClick={handleLogout}>LOGOUT</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
