import React, { useState, useEffect } from "react";
import Stats from "./Stats";
import Beds from "./Beds";
import Parameters from "./Paramtres";
import BasicTabs from "./BasicTabs";
import { Button } from "@mui/material";

export default function Details({
	redPatients,
	yellowPatients,
	greenPatients,
	scoreLog,
	patient,
}) {
	const [updatedPatient, setUpdatedPatient] = useState({});

	useEffect(() => {
		setUpdatedPatient(patient);
	}, [patient]);

	const scoreColor =
		patient.scorGeneralFinal <= 3
			? "bg-red-500"
			: patient.scorGeneralFinal <= 6
			? "bg-yellow-500"
			: "bg-green-500";

	function onDelete() {
		fetch(`http://localhost:8080/pacients/deletePacient/${patient.id}`, {
			method: "DELETE",
		})
			.then(() => window.location.reload())
			.catch((err) => console.error(err));
	}

	function onChangeAttribute(changes) {
		setUpdatedPatient((prev) => ({
			...prev,
			...changes,
		}));
	}

	function onUpdate() {
		fetch(`http://localhost:8080/pacients/update/${patient.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedPatient),
		})
			.then((res) => {
				if (res.ok) {
					alert("Patient updated successfully!");
				} else {
					alert("Update failed!");
				}
			})
			.catch((err) => console.error(err));
	}

	if (Object.keys(patient).length === 0) {
		return (
			<Beds
				greenPatients={greenPatients}
				redPatients={redPatients}
				yellowPatients={yellowPatients}
			/>
		);
	}

	return (
		<div className="flex flex-col items-center w-full px-4">
			<div className="relative w-full max-w-5xl mt-4">
	{/* Absolute buttons in top-right */}
	<div className="absolute top-0 right-0 flex gap-3">
		<Button onClick={onDelete} variant="contained" color="error">
			Delete
		</Button>
		<Button onClick={onUpdate} variant="contained" color="primary">
			Update
		</Button>
	</div>

	{/* Patient name */}
	<h1 className="text-5xl font-bold">{patient.nume}</h1>

	{/* Relocation score below name */}
	<div className="flex items-center gap-2 mt-3">
		<h2 className="text-lg font-semibold">Relocation score</h2>
		<div
			className={`${scoreColor} text-white font-bold w-8 h-8 px-3 py-1 rounded-full flex items-center justify-center`}
		>
			{patient.scorGeneralFinal}
		</div>
	</div>
</div>


			<div className="w-full flex justify-center">
			<BasicTabs
	scoreLog={scoreLog}
	patient={updatedPatient}
	onChange={onChangeAttribute}
/>
			</div>

			{/* <div className="mt-6 w-full max-w-5xl">
				<Parameters patient={updatedPatient} onChange={onChangeAttribute} />
			</div> */}
		</div>
	);
}
