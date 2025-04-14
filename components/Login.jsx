import React from "react";
import { useNavigate } from "react-router";

const Login = () => {
	let navigate = useNavigate();

	return (
		<div className="min-h-screen flex items-center justify-center bg-black px-4">
			<div className="bg-[#1a1a1a] rounded-2xl text-white shadow-lg p-8 w-full max-w-md">
				<h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
					Smart ICU
				</h2>

				<form className="space-y-5">
					<div>
						<label htmlFor="email" className="block text-sm text-white mb-1">
							Email address
						</label>
						<input
							type="email"
							id="email"
							placeholder="you@example.com"
							className="w-full px-4 py-2 border text-white border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm text-white mb-1">
							Password
						</label>
						<input
							type="password"
							id="password"
							placeholder="••••••••"
							className="w-full px-4 py-2 border text-white border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
						/>
					</div>

					<div className="flex items-center justify-between text-sm">
						<label className="flex items-center">
							<input
								type="checkbox"
								className="mr-2 rounded  border-gray-300"
							/>
							<p className="text-white">Remember me</p>
						</label>
						<a href="#" className="text-blue-600  hover:underline">
							Forgot password?
						</a>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
						onClick={() => navigate("/")}
					>
						Sign In
					</button>
				</form>

				<p className="mt-6 text-sm text-white text-center text-gray-600">
					Don’t have an account?{" "}
					<a href="#" className="text-blue-600 hover:underline">
						Register here
					</a>
				</p>
			</div>
		</div>
	);
};

export default Login;
