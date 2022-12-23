import "./navbar.scss";
import { Link } from "react-router-dom";

const Navbar = ({ profile }) => {
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
					{profile && (
						<>
							<span>{profile?.fullName}</span>
							{/* <img src={profile?.avatar} alt="" /> */}
							<button onClick={handleLogout}>LOGOUT</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
