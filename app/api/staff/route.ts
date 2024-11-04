import { getTotalNumberOfStaff } from "@/app/utils/db/staff";
import { NextResponse } from "next/server";

export async function GET() {
	const staffCount = await getTotalNumberOfStaff();
	return NextResponse.json(staffCount);
}
