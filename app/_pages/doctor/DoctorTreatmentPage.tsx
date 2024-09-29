import PatientConsultation from "@/app/_components/PatientConsultation";
import PatientDetails from "@/app/_components/PatientDetails";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { patient } from "@/app/utils/db/patient";
import { getServerSession } from "next-auth";
import MedicalRecords from "./MedicalRecords";

export default async function DoctorTreatmentPage({
	patientId,
	appointmentId,
}: {
	patientId: string;
	appointmentId?: string;
}) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/patient/${patientId}`,
		{
			cache: "no-cache",
		}
	);
	const patient: patient = await res.json();
	const doctor = await getServerSession(options);

	return (
		<main className="w-3/4 mt-24 flex flex-col mx-auto gap-5 h-3/4 sm:text-lg text-sm">
			<PatientDetails patient={patient} />
			{appointmentId && (
				<PatientConsultation
					patientId={patientId}
					doctorId={doctor?.user.id as string}
					appointmentId={appointmentId}
				/>
			)}

			<MedicalRecords medicalRecords={patient.medicalRecords} />
		</main>
	);
}
