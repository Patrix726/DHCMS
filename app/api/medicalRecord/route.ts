import { consultationData } from "@/app/_components/PatientConsultation";
import prisma from "@/app/client";
import { getDoctor } from "@/app/utils/db/doctor";
import {
	createMedicalRecord,
	getPatientMedicalRecords,
} from "@/app/utils/db/medicalRecord";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

type reqBody = {
	patientId: string;
	doctorId: string;
	appointmentId: string;
	data: consultationData;
};
export async function GET(req: NextRequest) {
	const patientId = req.nextUrl.searchParams.get("id");
	if (patientId === null)
		return NextResponse.json({
			message: "No patient id passed",
			error: true,
		});
	const medicalRecords = await getPatientMedicalRecords(patientId);
	return NextResponse.json(medicalRecords);
}
export async function POST(req: NextRequest) {
	const { patientId, doctorId, appointmentId, data }: reqBody =
		await req.json();
	const doctor = await getDoctor(doctorId);
	if (typeof doctor?.id === "undefined") {
		return NextResponse.json(
			{
				message: "Invalid Doctor Id. Unauthorized",
				error: true,
			},
			{ status: 403 }
		);
	}
	try {
		const medicalRecord = await createMedicalRecord({
			data,
			appointmentId,
			doctorId: doctor?.id,
			patientId,
		});
		return NextResponse.json(medicalRecord);
	} catch (e) {
		if (e instanceof PrismaClientKnownRequestError) {
			if (e.code === "P2002") {
				const target: any = e.meta?.target;
				if (Array.from(target).includes("appointmentId")) {
					console.log(target);
					return NextResponse.json(
						{
							message:
								"You can't submit more than one medical records for a single appointment",
							error: true,
						},
						{ status: 500 }
					);
				}
			}
		}
		return NextResponse.json(
			{
				message: "There was a server error",
				error: true,
			},
			{ status: 500 }
		);
	}
}
