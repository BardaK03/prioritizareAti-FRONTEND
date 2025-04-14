import React from "react";
import HeartLogo from "../src/assets/logo.png";
import LogoutIcon from "../src/assets/logout.png";
import { useNavigate } from "react-router";

export default function Navbar() {
	let navigate = useNavigate();

	return (
		<nav className="flex flex-col w-20 border-gray-700 border-r-1 border-r-gray-700 items-center justify-between bg-[#1a1a1a] text-white">
			<img  onClick={() => window.location.reload()} src={HeartLogo} alt="Heart Logo" className="h-14 w-14" />
			
			<button
				className="p-1 mb-2 rounded-md bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
				aria-label="Logo button"
				onClick={() => navigate("/login")}
			>
				<img  src={LogoutIcon} alt="Application Logo" className="h-10 w-10" />
			</button>
		</nav>
	);
}
