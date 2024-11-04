import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import {
	deleteAppointment,
	getAppointmentsCount,
	getDoctorAppointments,
	getPatientAppointments,
	patientAppointment,
} from "@/app/utils/db/appointment";

export async function GET() {
	const user = await getServerSession(options);
	switch (user?.user.role) {
		case "Patient":
			const patientApp = await getPatientAppointments(user.user.id);
			return NextResponse.json(patientApp);
		case "Doctor":
			const docApp = await getDoctorAppointments(user.user.id);
			return NextResponse.json(docApp?.appointments);
		case "Administrator":
			const appCount = await getAppointmentsCount();
			return NextResponse.json(appCount);
		default:
			return NextResponse.json(
				"You are unauthorized to use this api endpoint"
			);
	}
}
export async function DELETE(req: NextRequest) {
	const data: patientAppointment = await req.json();
	const appointment = await deleteAppointment(data.id);
	return NextResponse.json(appointment);
}
