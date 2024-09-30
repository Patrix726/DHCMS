import AdminDashboard from "@/app/_pages/admin/AdminDashboard";
import DoctorDashboard from "@/app/_pages/doctor/DoctorDashboard";
import PatientDashboard from "@/app/_pages/patient/PatientDashboard";
import ReceptionistDashboard from "@/app/_pages/receptionist/ReceptionistDashboard";
import Unauthorized from "@/app/_pages/Unauthorized";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
	const user = await getServerSession(options);

	switch (user?.user.role) {
		case "Patient":
			return <PatientDashboard />;
		case "Doctor":
			return <DoctorDashboard />;
		case "Receptionist":
			return <ReceptionistDashboard />;
		case "Administrator":
			return <AdminDashboard />;
		default:
			return <Unauthorized />;
	}
}
