import { getMedications } from "@/app/utils/db/medication";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const name = req.nextUrl.searchParams.get("search") as string;
	const medications = await getMedications(name);
	return NextResponse.json(medications);
}
