import { getStaffRoles } from "@/app/utils/db/staff";
import { NextResponse } from "next/server";

export async function GET() {
	const roles = await getStaffRoles();
	return NextResponse.json(roles);
}
