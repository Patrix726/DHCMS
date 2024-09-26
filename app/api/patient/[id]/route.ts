import { getPatient } from "@/app/utils/db/patient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const patient = await getPatient(params.id);
	return NextResponse.json(patient);
}
