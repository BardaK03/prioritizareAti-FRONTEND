import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";

const Beds = ({ redPatients, yellowPatients, greenPatients }) => {
  const totalBeds = 30;
  const occupiedBeds = redPatients + yellowPatients + greenPatients;
  const emptyBeds = Math.max(0, totalBeds - occupiedBeds);

  // Create beds array with actual patient distribution
  const beds = [];
  
  // Add critical patients (red)
  for (let i = 0; i < redPatients; i++) {
    beds.push({
      id: beds.length + 1,
      occupied: true,
      status: "critical",
      patientName: `Critical Patient ${i + 1}`
    });
  }
  
  // Add recovering patients (yellow)
  for (let i = 0; i < yellowPatients; i++) {
    beds.push({
      id: beds.length + 1,
      occupied: true,
      status: "recovering",
      patientName: `Recovering Patient ${i + 1}`
    });
  }
  
  // Add stable patients (green)
  for (let i = 0; i < greenPatients; i++) {
    beds.push({
      id: beds.length + 1,
      occupied: true,
      status: "stable",
      patientName: `Stable Patient ${i + 1}`
    });
  }
  
  // Add empty beds
  for (let i = 0; i < emptyBeds; i++) {
    beds.push({
      id: beds.length + 1,
      occupied: false,
      status: "empty",
      patientName: null
    });
  }

  // Split into 3 columns
  const columns = [[], [], []];
  beds.forEach((bed, index) => {
    columns[index % 3].push(bed);
  });

  return (
    <div className="flex flex-col md:flex-row items-start gap-8 p-4">
      {/* Left side - Stats and Pie Chart */}
      <div className="flex flex-col items-center">
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2 rounded-full"></div>
            <span className="text-white">Critical: {redPatients}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 mr-2 rounded-full"></div>
            <span className="text-white">Recovering: {yellowPatients}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2 rounded-full"></div>
            <span className="text-white">Stable: {greenPatients}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 mr-2 rounded-full"></div>
            <span className="text-white">Empty: {emptyBeds}</span>
          </div>
        </div>

        {/* Pie Chart */}
        <PieChart
          series={[{
            arcLabel: (item) => `${item.value}`,
            arcLabelMinAngle: 35,
            data: [
              { id: 0, color: "red", value: redPatients, label: "Critical" },
              { id: 1, color: "yellow", value: yellowPatients, label: "Recovering" },
              { id: 2, color: "green", value: greenPatients, label: "Stable" },
              { id: 3, color: "gray", value: emptyBeds, label: "Empty" },
            ],
          }]}
          width={400}
          height={300}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
              fill: "white",
            },
          }}
        />
      </div>

      {/* Right side - Beds visualization */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4 text-white">
          Hospital Ward Overview ({occupiedBeds}/30 occupied)
        </h2>
        <div className="flex justify-center gap-8">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {col.map((bed) => (
                <div
                  key={bed.id}
                  className={`
                    w-10 h-10 rounded-md border-2 
                    ${bed.occupied ? "border-gray-800" : "border-green-400"}
                    flex items-center justify-center relative 
                    cursor-pointer transition-all hover:scale-110
                    ${
                      bed.status === "critical" ? "bg-red-500" :
                      bed.status === "recovering" ? "bg-yellow-500" :
                      bed.status === "stable" ? "bg-green-500" :
                      "bg-gray-200"
                    }
                  `}
                  title={
                    bed.occupied 
                      ? `${bed.patientName} (${bed.status})` 
                      : "Available bed"
                  }
                >
                  <span className="absolute top-1 left-1 text-xs font-bold text-white">
                    {bed.id}
                  </span>
                  {bed.occupied && (
                    <span className="w-4 h-4 rounded-full bg-gray-900"></span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Beds;