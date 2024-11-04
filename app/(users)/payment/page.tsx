import PatientPayment from "@/app/_pages/patient/PatientInvoices";
import Unauthorized from "@/app/_pages/Unauthorized";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { invoices } from "@/app/utils/db/invoice";
import { getServerSession } from "next-auth";

export default async function Payment() {
	const user = await getServerSession(options);

	switch (user?.user.role) {
		case "Patient":
			const user = await getServerSession(options);
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_URL}/api/patient/${user?.user.id}/invoices`
			);
			const {
				dueInvoices,
				paidInvoices,
			}: { dueInvoices: invoices[]; paidInvoices: invoices[] } =
				await res.json();

			return (
				<PatientPayment
					dueInvoices={dueInvoices}
					paidInvoices={paidInvoices}
				/>
			);
		default:
			return <Unauthorized />;
	}
}
