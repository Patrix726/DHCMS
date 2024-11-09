import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { getProfile } from "@/app/utils/db/patient";
import { NextResponse } from "next/server";
import { getStaffProfile } from "@/app/utils/db/staff";

export async function GET() {
	const user = await getServerSession(options);
	if (typeof user?.user.id === "undefined") {
		return NextResponse.json(
			{ error: true, message: "Invalid Request" },
			{ status: 403 }
		);
	}
	const profile =
		user.user.role === "Patient"
			? await getProfile(user.user.id)
			: await getStaffProfile(user.user.id);
	return NextResponse.json(profile);
}
