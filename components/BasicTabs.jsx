import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Stats from "./Stats";
import Parametres from "./Paramtres";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
					{children}
				</Box>
			)}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function BasicTabs({ onChange, scoreLog, patient }) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box
			sx={{
				width: "100%",
				maxWidth: "1200px", // Adjust this as needed
				margin: "0 auto", // This centers the component
			}}
		>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
					centered // This centers the tabs
				>
					<Tab
						sx={{
							color: "gray",
						}}
						label="Patient history"
						{...a11yProps(0)}
					/>
					<Tab
						sx={{
							color: "gray",
						}}
						label="Parametres"
						{...a11yProps(1)}
					/>
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<Stats scoreLog={scoreLog} patient={patient} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<Parametres patient={patient} onChange={onChange}/>
			</CustomTabPanel>
		</Box>
	);
}
