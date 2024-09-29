"use client";

import Popup from "@/app/_components/Popup";
import { medicalRecord } from "@/app/utils/db/medicalRecord";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

const MedicalRecords = ({
	medicalRecords,
}: {
	medicalRecords: medicalRecord[];
}) => {
	const [popup, setPopup] = useState<medicalRecord>();

	const patientMedicalRecords = medicalRecords.reduce(
		(acc: ReactNode[], record) => {
			const doctor = record.doctor.staff;
			if (record.diagnosis.length > 0) {
				return [
					...acc,
					<MedicalRecordElement
						datetime={new Date(record.appointment.datetime)}
						diag={record.diagnosis.join(", ")}
						doctor={doctor}
						onClick={() => setPopup(record)}
						key={record.id}
					/>,
				];
			}
			return acc;
		},
		[]
	);
	return (
		<>
			<MedicalRecordDetails popup={popup} setPopup={setPopup} />
			<div className="rounded-3xl w-full p-5 border-2 border-blue-700 flex flex-col gap-4">
				<h1 className="text-lg sm:text-2xl font-bold">
					Past Medical Records
				</h1>
				<div className="flex flex-col justify-center items-center gap-2">
					<div className="flex w-full font-bold sm:text-lg md:text-xl p-5 rounded-lg">
						<p className="w-full">Diagnosis</p>
						<p className="w-full">Diagnosed by</p>
						<p className="w-1/3 text-center">Appointment Date</p>
					</div>
					{patientMedicalRecords.length > 0 ? (
						patientMedicalRecords
					) : (
						<p className="py-24">No previous medical records</p>
					)}
				</div>
			</div>
		</>
	);
};

const MedicalRecordElement = ({
	datetime,
	diag,
	doctor,
	onClick,
}: {
	diag: string;
	doctor: { firstName: string; middleName: string };
	datetime: Date;
	onClick: () => void;
}) => {
	return (
		<div
			className="flex w-full bg-blue-100 p-5 rounded-lg cursor-pointer"
			onClick={onClick}
		>
			<p className="w-full text-sm sm:text-lg">{diag}</p>
			<p className="w-full text-sm sm:text-lg">
				{`Dr. ${doctor.firstName} ${doctor.middleName}`}
			</p>
			<p className="w-1/3 text-center">{datetime.toLocaleDateString()}</p>
		</div>
	);
};

const MedicalRecordDetails = ({
	popup,
	setPopup,
}: {
	popup: medicalRecord | undefined;
	setPopup: Dispatch<SetStateAction<medicalRecord | undefined>>;
}) => {
	if (typeof popup === "undefined") return;
	return (
		<Popup
			isOpen={typeof popup !== "undefined"}
			onClose={() => setPopup(undefined)}
			noMinHeight={true}
		>
			<div className="flex flex-col w-full relative pt-7">
				<div className="w-full flex justify-end py-4 px-5 text-2xl absolute right-0 top-0">
					<FontAwesomeIcon
						icon={faClose}
						onClick={() => setPopup(undefined)}
						className="cursor-pointer text-blue-950 hover:text-blue-800"
					/>
				</div>
				<div className="px-8 py-5 flex flex-col gap-2">
					<div className="flex gap-2">
						<p className="font-bold w-44">Diagnosis:</p>
						<p>{popup.diagnosis.join(", ")}</p>
					</div>
					<div className="flex gap-2">
						<p className="font-bold w-44">Appointment Date:</p>
						<p>
							{new Date(
								popup.appointment.datetime
							).toLocaleDateString()}
						</p>
					</div>
					<div className="flex gap-2">
						<p className="font-bold w-44">Diagnosed by:</p>
						<p>{`Dr. ${popup.doctor.staff.firstName} ${popup?.doctor.staff.middleName}`}</p>
					</div>
					<div className="flex gap-2">
						<p className="font-bold w-44">Symptoms:</p>
						<p>
							{popup.symptoms.length > 0
								? popup.symptoms.join(", ")
								: "No symptoms recorded"}
						</p>
					</div>
					<div className="flex gap-2">
						<p className="font-bold w-44">Medication:</p>
						<p>
							{popup.prescription.length > 0
								? popup?.prescription.map((pres, i) => (
										<div key={i} className="flex gap-2">
											<span>{pres.medication.name},</span>
											<span>{pres.dosage}</span>
										</div>
								  ))
								: "No Medication issued"}
						</p>
					</div>
				</div>
			</div>
		</Popup>
	);
};

export default MedicalRecords;
