import { getDiseases } from "@/app/utils/db/disease";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const value = req.nextUrl.searchParams.get("search") ?? "";
	const diseases = await getDiseases(value);
	return NextResponse.json(diseases);
}
