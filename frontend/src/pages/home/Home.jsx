import "./home.scss";

const Home = ({ profile }) => {
	return (
		<div className="home">
			<div className="container">
				<h1>{profile?.fullName}</h1>
				<span>Welcome to our platform.</span>
			</div>
		</div>
	);
};

export default Home;
