import "./App.css";
import React from "react";
import { useEffect, useState } from "react";
import PatientList from "../components/PatientList";
import Details from "../components/Details";
import Navbar from "../components/Navbar";
import AddPatientForm from "../components/AddPatientForm";
import { API_CONFIG } from "../config";

function App() {
	const [selectedPatient, setSelectedPatient] = React.useState({});
	const [selectedPatientScoreLog, setSelectedPatientScoreLog] = useState();
	const [patients, setPatients] = useState([]);
	const [redPatients, setRedPatients] = useState([]);
	const [yellowPatients, setYellowPatients] = useState([]);
	const [greenPatients, setGreenPatients] = useState([]);
	const [addPatient, setAddPatient] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const selectedPatientId = selectedPatient.id;


	const onClickedAdd = () => {
		setAddPatient(true);
	};

	const getPatientById = async (patientId) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`${API_CONFIG.BASE_URL}/pacients/getPacientDetails/${patientId}`
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// First check if response has content
			const text = await response.text();
			if (!text) {
				throw new Error("Empty response from server");
			}

			// Try to parse JSON
			const data = JSON.parse(text);
			console.log(data);
			setAddPatient(false);
			setSelectedPatient(data.pacient);
			setSelectedPatientScoreLog(data.pacientScoreLogDTO);
		} catch (err) {
			setError(`Failed to load patient: ${err.message}`);
			console.error(`Error fetching patient ${patientId}:`, err);
			setSelectedPatient(null); // Clear previous patient on error
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await fetch(
					`${API_CONFIG.BASE_URL}/pacients/getPacients`
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setPatients(data);

				// Filter red and yellow patients by score
				const red = data.filter((p) => p.scorGeneralFinal < 3.1);
				const yellow = data.filter(
					(p) => p.scorGeneralFinal >= 3.1 && p.scorGeneralFinal < 7.0
				);
				const green = data.filter((p) => p.scorGeneralFinal >= 7.0);
				setRedPatients(red.length);
				setYellowPatients(yellow.length);
				setGreenPatients(green.length);
			} catch (err) {
				setError(err.message);
				console.error("Error fetching patients:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchPatients();
	}, []);

	if (loading) {
		console.log("Loading patients...");
	}
	if (error) {
		console.log(error);
	}
	if (patients) {
		console.log(patients);
	}

	return (
		<div className="flex w-full h-screen bg-black text-white">
			<Navbar />
			<div className="w-1/3 m-5 h-[calc(100vh-40px)] border-1 border-gray-700 rounded-md overflow-y-scroll scrollbar-hide">
				<PatientList
					patients={patients}
					selectedPatientId={selectedPatientId}
					onClickedAdd={onClickedAdd}
					onSelectPatient={(patientId) => {
						getPatientById(patientId);
					}}
				/>
			</div>

			<div className="w-2/3 m-5	flex items-start p-5  bg-[#1a1a1a] border-1 border-gray-700 rounded-md">
				{addPatient ? (
					<AddPatientForm />
				) : (
					<Details
						redPatients={redPatients}
						yellowPatients={yellowPatients}
						greenPatients={greenPatients}
						scoreLog={selectedPatientScoreLog}
						patient={selectedPatient}
					/>
				)}
			</div>
		</div>
	);
}

export default App;