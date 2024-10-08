import AdminRegister from "@/app/_pages/admin/AdminRegister";
import ReceptionistRegister from "@/app/_pages/receptionist/ReceptionistRegister";
import Unauthorized from "@/app/_pages/Unauthorized";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Register() {
	const user = await getServerSession(options);

	switch (user?.user.role) {
		case "Administrator":
			const departmentsRes = fetch(
				`${process.env.NEXT_PUBLIC_BASE_URL}/api/departments`
			).then((res) => res.json());
			const rolesRes = fetch(
				`${process.env.NEXT_PUBLIC_BASE_URL}/api/roles`
			).then((res) => res.json());
			const [departments, roles] = await Promise.all([
				departmentsRes,
				rolesRes,
			]);
			return <AdminRegister departments={departments} roles={roles} />;
		case "Receptionist":
			return <ReceptionistRegister />;
		default:
			return <Unauthorized />;
	}
}
