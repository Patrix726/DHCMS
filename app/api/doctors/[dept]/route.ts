import { getDoctorsInDepartment } from "@/app/utils/db/doctor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { dept: string } }
) {
	const doctors = await getDoctorsInDepartment(params.dept);
	return NextResponse.json(doctors);
}
