import React from "react";
import PatientCard from "./PatientCard";
import { Button } from "@mui/material";

export default function PatientList({
	patients,
	selectedPatientId,
	onSelectPatient,
	onClickedAdd,
}) {
	const handleClick = (patientId) => {
		onSelectPatient(patientId);
	};
	const handleClickAdd = () => {
		onClickedAdd();
	};

	// Sort patients by score ascending
	const sortedPatients = [...patients].sort(
		(a, b) => b.scorGeneralFinal - a.scorGeneralFinal
	);

	return (
		<div className="w-full h-screen overflow-y-auto bg-[#1a1a1a] p-4 scrollbar-thin scrollbar-thumb-[#034c81] scrollbar-track-[#141629]">
			<Button onClick={handleClickAdd} variant="contained" color="success">
				Add Patient
			</Button>
			{sortedPatients.map((patient) => (
				<PatientCard
					key={patient.id}
					patient={patient}
					selected={patient.id === selectedPatientId}
					onClick={() => handleClick(patient.id)}
				/>
			))}
		</div>
	);
}
