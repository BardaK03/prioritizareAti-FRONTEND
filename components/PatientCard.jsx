import React from "react";

export default function PatientCard({ selected, patient, onClick }) {
	const scoreColor =
		patient.scorGeneralFinal <= 3
			? "bg-red-500"
			: patient.scorGeneralFinal <= 6
			? "bg-yellow-500"
			: "bg-green-500";

	const cardStyling = selected
		? "w-full p-4 mb-2 rounded-lg bg-gray-700 hover:bg-gray-700 transition-colors cursor-pointer border-b border-[rgba(255,255,255,0.08)]"
		: "w-full p-4 mb-2 rounded-lg bg-[#1a1a1a] hover:bg-gray-700 transition-colors cursor-pointer border-b border-[rgba(255,255,255,0.08)]";

	return (
		<div className={cardStyling} onClick={onClick}>
			<div className="flex justify-between items-center">
				<div>
					<h3 className="text-white font-medium">{patient.nume}</h3>
					{/* <p className="text-[rgba(255,255,255,0.7)] text-sm">
						Condition: {patient.condition}
					</p> */}
				</div>
				<div
					className={`${scoreColor} text-white font-bold px-3 py-1 rounded-full`}
				>
					{patient.scorGeneralFinal}
				</div>
			</div>
		</div>
	);
}
