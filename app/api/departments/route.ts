import prisma from "@/app/client";
import { getDepartments } from "@/app/utils/db/department";
import { NextResponse } from "next/server";

export async function GET() {
	const departments = await getDepartments();
	return NextResponse.json(departments);
}
