import {
	getLastMonthPayments,
	getTotalUnpaidDues,
} from "@/app/utils/db/invoice";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const isTotal = req.nextUrl.searchParams.get("total");
	if (isTotal) {
		const invoicesTotal = await Promise.all([
			getTotalUnpaidDues(),
			getLastMonthPayments(),
		]);
		return NextResponse.json(invoicesTotal);
	}

	return NextResponse.json("You are unauthorized to use this api endpoint");
}
