import malePic from "@/public/Male.svg";
import femalePic from "@/public/Male.svg";
import Image from "next/image";
import { patient } from "../../utils/db/patient";
const PatientDetails = ({ patient }: { patient: patient }) => {
	return (
		<div className="w-full bg-blue-700 text-white flex md:flex-row flex-col items-center p-5 rounded-3xl gap-4 ">
			<div className="flex w-full gap-5 items-center ">
				<Image
					src={patient.sex === "MALE" ? malePic : femalePic}
					alt="Profile pic"
					className="w-32 h-32 bg-blue-100 rounded-xl"
				/>
				<div className="flex flex-col justify-around h-full">
					<div className="flex flex-col gap-0">
						<h1 className="text-lg sm:text-xl font-bold">{`${patient.firstName} ${patient.middleName} ${patient.lastName}`}</h1>
						<h6>
							{new Date().getFullYear() -
								new Date(patient.birthDate).getFullYear()}{" "}
							Years old
						</h6>
						<h4>{patient.sex}</h4>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-3 w-full ml-4 gap-4">
				<PatientDescription
					label="Height"
					value={patient.patientRecord?.height}
				/>
				<PatientDescription
					label="Weight"
					value={patient.patientRecord?.weight}
				/>
				<PatientDescription
					label="Blood Type"
					value={patient.patientRecord?.bloodType}
				/>
				<PatientDescription
					label="Allergies"
					value={patient.patientRecord?.allergies.join(", ")}
				/>
				<PatientDescription
					label="Family History"
					value={patient.patientRecord?.familyHistory}
				/>
				<PatientDescription
					label="Condition"
					value={patient.patientRecord?.patientCondition}
				/>
			</div>
		</div>
	);
};

const PatientDescription = ({
	label,
	value,
}: {
	label: string;
	value?: string | number | null;
}) => {
	return (
		<div className="flex flex-col">
			<p>{label}</p>
			<p className="font-bold">{value || "Unknown"}</p>
		</div>
	);
};

export default PatientDetails;
