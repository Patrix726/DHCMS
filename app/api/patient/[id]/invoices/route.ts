import prisma from "@/app/client";
import {
	getPatientDueInvoices,
	getPatientPaidInvoices,
} from "@/app/utils/db/patient";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const dueInvoices = await getPatientDueInvoices(params.id);
	const paidInvoices = await getPatientPaidInvoices(params.id);

	return NextResponse.json({ dueInvoices, paidInvoices });
}
