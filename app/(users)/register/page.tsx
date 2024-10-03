import AdminRegister from "@/app/_pages/admin/AdminRegister";
import ReceptionistRegister from "@/app/_pages/receptionist/ReceptionistRegister";
import Unauthorized from "@/app/_pages/Unauthorized";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Register() {
	const user = await getServerSession(options);

	switch (user?.user.role) {
		case "Administrator":
			return <AdminRegister />;
		case "Receptionist":
			return <ReceptionistRegister />;
		default:
			return <Unauthorized />;
	}
}
