import { getPatients } from "@/app/utils/db/patient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const firstName = req.nextUrl.searchParams.get("firstname") ?? "";
	const middleName = req.nextUrl.searchParams.get("middlename") ?? "";
	const lastName = req.nextUrl.searchParams.get("lastname") ?? "";
	const mobileNo = req.nextUrl.searchParams.get("mobileNo") ?? "";
	const email = req.nextUrl.searchParams.get("email") ?? "";
	const patients = await getPatients({
		firstName,
		middleName,
		lastName,
		mobileNo,
		email,
	});
	return NextResponse.json(patients);
}
