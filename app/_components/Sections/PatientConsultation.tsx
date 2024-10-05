"use client";
import { FormEvent, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Prescription from "./Consultation/Prescription";
import Diagnosis from "./Consultation/Diagnosis";
import Symptoms from "./Consultation/Symptoms";
import Examination from "./Consultation/Examination";
import Review from "./Consultation/Review";
import { SessionProvider } from "next-auth/react";
import { useConfirm } from "../../_hooks/useConfirm";
import Popup from "../Popups/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { Medication } from "@prisma/client";
import { useRouter } from "next/navigation";
import Button, { variants } from "../Buttons/Button";
import Warning from "../Popups/Warning";
import ErrorPopup from "../Popups/Error";
export type examinationData = {
	vitals?: {
		temperature?: number;
		bloodPressure?: string;
		respiratoryRate?: number;
		pulseRate?: number;
	};
	heent?: string;
	lgs?: string;
};
export type prescriptionData = {
	medication: Medication;
	dosage: string;
	duration: number;
	quantity: number;
	instruction?: string;
};
export type consultationData = {
	symptoms: Set<string>;
	examination: examinationData;
	diagnosis: string[];
	prescription: prescriptionData[];
};
const PatientConsultation = ({
	patientId,
	doctorId,
	appointmentId,
}: {
	patientId: string;
	doctorId: string;
	appointmentId: string;
}) => {
	const [consulting, setConsulting] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const router = useRouter();
	const [data, setData] = useState<consultationData>({
		symptoms: new Set(),
		examination: {},
		diagnosis: [],
		prescription: [],
	});
	const { open, handleConfirm, handleCancel, confirm } = useConfirm();

	async function handleSave() {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/medicalRecord`,
			{
				method: "POST",
				body: JSON.stringify({
					patientId: patientId,
					doctorId: doctorId,
					appointmentId: appointmentId,
					data: data,
				}),
			}
		);
		const apiData = await res.json();
		if (!res.ok) {
			setError(apiData.message);
			return;
		}
		setConsulting(false);
		router.refresh();
	}
	async function handleClick() {
		let confirmed = true;
		if (consulting) {
			confirmed = (await confirm()) as boolean;
		}
		confirmed && setConsulting((prev) => !prev);
	}
	function handleSubmit(
		e: FormEvent<HTMLFormElement>,
		field: string,
		data: Set<string> | examinationData
	) {
		if (field === "symptoms" && data instanceof Set) {
			setData((prev) => {
				const newSet = new Set(prev.symptoms);

				return {
					...prev,
					symptoms: newSet.union(data),
				};
			});
			e.currentTarget.reset();
		} else if (field === "examination" && !(data instanceof Set)) {
			setData((prev) => {
				return {
					...prev,
					examination: data,
				};
			});
		}
	}
	return (
		<div className="flex flex-col gap-5">
			<Warning
				handleCancel={handleCancel}
				handleConfirm={handleConfirm}
				isOpen={open}
			>
				<p>Are you sure you want to stop the consultation?</p>
				<p>Your data will be lost</p>
			</Warning>
			<div className="w-full flex justify-end">
				<Button
					onClick={handleClick}
					label={`${consulting ? "Stop" : "Start"} Consultation`}
					variant={variants.Primary}
					size="medium"
				/>
			</div>
			<ErrorPopup isOpen={!!error} handleClick={() => setError("")}>
				<p className="text-gray-600 text-xl">{error}</p>
			</ErrorPopup>
			{consulting && (
				<div className="rounded-3xl w-full p-5 border-2 border-blue-700 flex flex-col gap-4 min-h-[550px] overflow-scroll h-fit">
					<Tabs selectedTabClassName="bg-blue-700 text-white rounded-t-lg">
						<TabList className={"border-b border-blue-700"}>
							<Tab>Symptoms</Tab>
							<Tab>Examination</Tab>
							<Tab>Diagnosis</Tab>
							<Tab>Prescription</Tab>
							<Tab>Review</Tab>
						</TabList>
						<TabPanel>
							<Symptoms
								data={data}
								setData={setData}
								handleSubmit={handleSubmit}
							/>
						</TabPanel>
						<TabPanel>
							<Examination handleSubmit={handleSubmit} />
						</TabPanel>
						<TabPanel>
							<Diagnosis data={data} setData={setData} />
						</TabPanel>
						<TabPanel>
							<Prescription data={data} setData={setData} />
						</TabPanel>
						<TabPanel>
							<SessionProvider>
								<Review data={data} handleSave={handleSave} />
							</SessionProvider>
						</TabPanel>
					</Tabs>
				</div>
			)}
		</div>
	);
};

export default PatientConsultation;
